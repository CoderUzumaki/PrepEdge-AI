import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranscribe } from "@/hooks/useTranscribe";
import { getErrorMessage } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

const PREFERRED_MIME = "audio/webm;codecs=opus";

/**
 * RecordingControls — MediaRecorder mic UI with pause/stop transcription triggers.
 * @param {Object} props
 * @param {function(string): void} props.onTranscript - Appends transcribed text
 * @param {function(number): void} [props.onDuration] - Reports total speaking seconds
 * @param {boolean} [props.disabled] - Disables recording (e.g. STT quota exceeded)
 * @param {function(string): void} [props.onError]
 */
export function RecordingControls({ onTranscript, onDuration, disabled = false, onError }) {
  const transcribeMutation = useTranscribe();
  const [status, setStatus] = useState("idle");
  const [elapsed, setElapsed] = useState(0);

  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animRef = useRef(null);
  const totalDurationRef = useRef(0);
  const stopIntentRef = useRef("idle");
  const elapsedRef = useRef(0);

  const getMimeType = () => {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(PREFERRED_MIME)) {
      return PREFERRED_MIME;
    }
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported("audio/webm")) {
      return "audio/webm";
    }
    return "";
  };

  const stopVisualizer = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = null;
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = Math.max(2, canvas.width / bufferLength);
      let x = 0;
      for (let i = 0; i < bufferLength; i += 4) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = "var(--color-primary)";
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
    };
    draw();
  };

  const startTimer = () => {
    timerRef.current = window.setInterval(() => {
      setElapsed((s) => {
        const next = s + 1;
        elapsedRef.current = next;
        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const cleanupStream = useCallback(() => {
    stopTimer();
    stopVisualizer();
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
  }, []);

  useEffect(() => () => cleanupStream(), [cleanupStream]);

  const transcribeChunks = async () => {
    if (!chunksRef.current.length) return;
    const mimeType = getMimeType() || "audio/webm";
    const blob = new Blob(chunksRef.current, { type: mimeType });
    chunksRef.current = [];

    setStatus("processing");
    try {
      const result = await transcribeMutation.mutateAsync(blob);
      if (result?.text) {
        onTranscript(result.text);
      }
    } catch (err) {
      onError?.(getErrorMessage(err, "Transcription failed. You can type your answer instead."));
    } finally {
      if (stopIntentRef.current === "pause") {
        setStatus("paused");
      } else if (stopIntentRef.current === "stop") {
        cleanupStream();
        setStatus("idle");
      }
      stopIntentRef.current = "idle";
    }
  };

  const ensureStream = async () => {
    if (streamRef.current) return streamRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    return stream;
  };

  const setupVisualizer = (stream) => {
    if (!audioContextRef.current) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
    }
    drawWaveform();
  };

  const startRecorder = async () => {
    if (disabled) return;

    try {
      const stream = await ensureStream();
      setupVisualizer(stream);

      const mimeType = getMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        totalDurationRef.current += elapsedRef.current;
        onDuration?.(totalDurationRef.current);
        recorderRef.current = null;
        await transcribeChunks();
        setElapsed(0);
        elapsedRef.current = 0;
      };

      recorder.start();
      recorderRef.current = recorder;
      setStatus("recording");
      startTimer();
    } catch {
      onError?.("Microphone access denied. Use text input instead.");
      setStatus("idle");
    }
  };

  const handlePause = () => {
    if (recorderRef.current?.state === "recording") {
      stopIntentRef.current = "pause";
      stopTimer();
      stopVisualizer();
      recorderRef.current.stop();
    }
  };

  const handleResume = () => {
    if (status === "paused") {
      startRecorder();
    }
  };

  const handleStop = () => {
    if (recorderRef.current?.state === "recording") {
      stopIntentRef.current = "stop";
      stopTimer();
      stopVisualizer();
      recorderRef.current.stop();
      return;
    }
    cleanupStream();
    setStatus("idle");
    setElapsed(0);
    elapsedRef.current = 0;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const isProcessing = status === "processing" || transcribeMutation.isPending;
  const isRecording = status === "recording";

  return (
    <div className="space-y-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-[var(--color-foreground)]">Voice input</p>
        <span className="text-xs tabular-nums text-[var(--color-muted)]">
          {isRecording ? "Listening…" : isProcessing ? "Processing…" : "Ready"}
          {isRecording || isProcessing ? ` · ${formatTime(elapsed)}` : ""}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={320}
        height={48}
        className={cn(
          "h-12 w-full rounded-md bg-[var(--color-card)]",
          !isRecording && "opacity-40"
        )}
        aria-hidden="true"
      />

      {isProcessing && (
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <p className="text-xs text-[var(--color-muted)]">Transcribing your speech…</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {status === "idle" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isProcessing}
            onClick={startRecorder}
            aria-label="Start recording"
          >
            <Mic size={16} aria-hidden="true" />
            Record
          </Button>
        )}

        {isRecording && (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePause}
              aria-label="Pause and transcribe"
            >
              <Pause size={16} aria-hidden="true" />
              Pause
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleStop}
              aria-label="Stop recording"
            >
              <Square size={16} aria-hidden="true" />
              Stop
            </Button>
          </>
        )}

        {status === "paused" && (
          <>
            <Button type="button" variant="outline" size="sm" onClick={handleResume} aria-label="Resume recording">
              <Play size={16} aria-hidden="true" />
              Resume
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                cleanupStream();
                setStatus("idle");
              }}
            >
              Done
            </Button>
          </>
        )}
      </div>

      {disabled && (
        <p className="text-xs text-[var(--color-warning)]">
          Daily voice transcription limit reached. Type your answer below.
        </p>
      )}
    </div>
  );
}
