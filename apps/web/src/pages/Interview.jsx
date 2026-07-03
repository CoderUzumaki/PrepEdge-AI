import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useInterviewQuestions,
  useSubmitAnswer,
  useScoringStatus,
  useUpdateProgress,
} from "@/hooks/useInterview";
import { useAuth } from "@/context/AuthContext";
import { useQuotas } from "@/hooks/useQuotas";
import { RecordingControls } from "@/components/interview/RecordingControls";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Toast from "@/components/Toast";
import { getErrorMessage } from "@/lib/api/errors";
import { analyzeTranscript } from "@/utils/speechAnalysis";
import { ArrowRight, Pause, Volume2 } from "lucide-react";

export default function Interview() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: quotas } = useQuotas();
  const { data: qData, isLoading } = useInterviewQuestions(interviewId);
  const submitAnswer = useSubmitAnswer(interviewId);
  const updateProgress = useUpdateProgress(interviewId);
  const { data: scoringStatus } = useScoringStatus(interviewId, submitAnswer.isSuccess);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [speechDuration, setSpeechDuration] = useState(0);
  const [speechMetrics, setSpeechMetrics] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const [submitting, setSubmitting] = useState(false);

  const ttsEnabled = profile?.preferences?.ttsEnabled ?? false;
  const questions = qData?.questions || [];
  const question = questions[currentIndex];
  const sttAtLimit = quotas?.stt_day?.remaining === 0;

  useEffect(() => {
    if (qData?.currentQuestionIndex) setCurrentIndex(qData.currentQuestionIndex);
  }, [qData?.currentQuestionIndex]);

  useEffect(() => {
    if (ttsEnabled && question?.question) {
      const utterance = new SpeechSynthesisUtterance(question.question);
      window.speechSynthesis.speak(utterance);
    }
  }, [currentIndex, question?.question, ttsEnabled]);

  useEffect(() => {
    setSpeechMetrics(analyzeTranscript(answer, speechDuration));
  }, [answer, speechDuration]);

  const appendTranscript = useCallback((text) => {
    setAnswer((prev) => (prev ? `${prev.trim()} ${text.trim()}` : text.trim()));
  }, []);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      await submitAnswer.mutateAsync({
        questionIndex: currentIndex,
        answer: answer.trim(),
        speechMetrics: speechMetrics ?? undefined,
      });
      await updateProgress.mutateAsync({ currentQuestionIndex: currentIndex + 1 });

      if (currentIndex + 1 >= questions.length) {
        navigate(`/interview/report/${interviewId}`);
      } else {
        setCurrentIndex((i) => i + 1);
        setAnswer("");
        setSpeechDuration(0);
        setSpeechMetrics(null);
      }
    } catch (err) {
      setToast({ show: true, message: getErrorMessage(err, "Submit failed"), type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePause = async () => {
    await updateProgress.mutateAsync({ currentQuestionIndex: currentIndex, status: "in_progress" });
    navigate("/dashboard");
  };

  if (isLoading || qData?.status === "generating") {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <p className="text-center text-[var(--color-muted)]">
          {qData?.status === "generating" ? "Generating personalized questions..." : "Loading..."}
        </p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-[var(--color-muted)] mb-4">Questions not ready yet.</p>
        <Button asChild><Link to="/dashboard">Back to Dashboard</Link></Button>
      </div>
    );
  }

  const currentScore = scoringStatus?.answers?.find((a) => a.question === question?.question);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary">Question {currentIndex + 1} of {questions.length}</Badge>
        <Button variant="outline" size="sm" onClick={handlePause}>
          <Pause size={14} /> Save & Exit
        </Button>
      </div>

      <div className="w-full bg-[var(--color-secondary)] rounded-full h-2 mb-6">
        <div
          className="bg-[var(--color-primary)] h-2 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle className="text-lg leading-relaxed">{question?.question}</CardTitle>
          {ttsEnabled && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Read question aloud"
              onClick={() => {
                const u = new SpeechSynthesisUtterance(question.question);
                window.speechSynthesis.speak(u);
              }}
            >
              <Volume2 size={18} />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <RecordingControls
            onTranscript={appendTranscript}
            onDuration={setSpeechDuration}
            disabled={sttAtLimit}
            onError={(message) => setToast({ show: true, message, type: "error" })}
          />

          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type or record your answer. Edit the transcript before submitting."
            rows={6}
          />

          {speechMetrics && speechMetrics.wordCount > 0 && (
            <p className="text-xs text-[var(--color-muted)]">
              {speechMetrics.wordCount} words
              {speechMetrics.wordsPerMinute > 0 ? ` · ~${speechMetrics.wordsPerMinute} wpm` : ""}
              {speechMetrics.fillerCount > 0
                ? ` · ${speechMetrics.fillerCount} filler${speechMetrics.fillerCount === 1 ? "" : "s"}`
                : ""}
            </p>
          )}

          {currentScore?.scoringStatus === "pending" && (
            <Badge variant="outline">Scoring in progress...</Badge>
          )}

          <Button onClick={handleSubmit} disabled={submitting || !answer.trim()} className="w-full">
            {submitting ? "Submitting..." : currentIndex + 1 >= questions.length ? "Finish Interview" : "Next Question"}
            <ArrowRight size={16} />
          </Button>
        </CardContent>
      </Card>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, show: false }))} />
    </div>
  );
}
