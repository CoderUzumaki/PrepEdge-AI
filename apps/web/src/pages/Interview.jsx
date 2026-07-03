import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useInterviewQuestions,
  useSubmitAnswer,
  useScoringStatus,
  useUpdateProgress,
} from "@/hooks/useInterview";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Toast from "@/components/Toast";
import { getErrorMessage } from "@/lib/api/errors";
import { Mic, MicOff, ArrowRight, Pause, Volume2 } from "lucide-react";
import { analyzeSpeech } from "@/utils/speechAnalysis";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function Interview() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: qData, isLoading } = useInterviewQuestions(interviewId);
  const submitAnswer = useSubmitAnswer(interviewId);
  const updateProgress = useUpdateProgress(interviewId);
  const { data: scoringStatus } = useScoringStatus(interviewId, submitAnswer.isSuccess);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [analyzedWords, setAnalyzedWords] = useState([]);
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });
  const [submitting, setSubmitting] = useState(false);

  const ttsEnabled = profile?.preferences?.ttsEnabled ?? false;
  const questions = qData?.questions || [];
  const question = questions[currentIndex];

  useEffect(() => {
    if (qData?.currentQuestionIndex) setCurrentIndex(qData.currentQuestionIndex);
  }, [qData?.currentQuestionIndex]);

  useEffect(() => {
    if (ttsEnabled && question?.question) {
      const utterance = new SpeechSynthesisUtterance(question.question);
      window.speechSynthesis.speak(utterance);
    }
  }, [currentIndex, question?.question, ttsEnabled]);

  const startRecording = useCallback(() => {
    if (!SpeechRecognition) {
      setToast({ show: true, message: "Speech recognition not supported in this browser", type: "error" });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    const words = [];

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        words.push({ word: event.results[i][0].transcript, confidence: event.results[i][0].confidence });
      }
      setAnswer((prev) => prev + transcript);
      const result = analyzeSpeech(words);
      setAnalyzedWords(result.analyzedWords);
      setStats(result.stats);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    setIsRecording(true);
  }, []);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      await submitAnswer.mutateAsync({ questionIndex: currentIndex, answer });
      await updateProgress.mutateAsync({ currentQuestionIndex: currentIndex + 1 });

      if (currentIndex + 1 >= questions.length) {
        navigate(`/interview/report/${interviewId}`);
      } else {
        setCurrentIndex((i) => i + 1);
        setAnswer("");
        setAnalyzedWords([]);
        setStats(null);
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
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePause}>
            <Pause size={14} /> Save & Exit
          </Button>
        </div>
      </div>

      <div className="w-full bg-[var(--color-secondary)] rounded-full h-2 mb-6">
        <div className="bg-[var(--color-primary)] h-2 rounded-full transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle className="text-lg leading-relaxed">{question?.question}</CardTitle>
          {ttsEnabled && (
            <Button variant="ghost" size="icon" onClick={() => {
              const u = new SpeechSynthesisUtterance(question.question);
              window.speechSynthesis.speak(u);
            }}>
              <Volume2 size={18} />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type or record your answer..."
            rows={6}
          />

          {analyzedWords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {analyzedWords.map((w, i) => (
                <span key={i} className={`text-xs px-1 rounded ${w.level === "high" ? "bg-emerald-100 text-emerald-800" : w.level === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
                  {w.word}
                </span>
              ))}
            </div>
          )}

          {stats && (
            <p className="text-xs text-[var(--color-muted)]">
              Confidence: {stats.avgConfidence}% · Words: {stats.wordCount}
            </p>
          )}

          {currentScore?.scoringStatus === "pending" && (
            <Badge variant="outline">Scoring in progress...</Badge>
          )}

          <div className="flex gap-3">
            <Button variant={isRecording ? "destructive" : "outline"} onClick={isRecording ? () => setIsRecording(false) : startRecording}>
              {isRecording ? <><MicOff size={16} /> Stop</> : <><Mic size={16} /> Record</>}
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || !answer.trim()} className="flex-1">
              {submitting ? "Submitting..." : currentIndex + 1 >= questions.length ? "Finish Interview" : "Next Question"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, show: false }))} />
    </div>
  );
}
