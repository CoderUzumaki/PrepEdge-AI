import { Link } from "react-router-dom";
import { useDashboardAnalytics } from "@/hooks/useDashboard";
import { useReports } from "@/hooks/useReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Target, Award } from "lucide-react";
import { getErrorMessage } from "@/lib/api/errors";

export default function Dashboard() {
  const { data: analytics, isLoading: analyticsLoading, error } = useDashboardAnalytics();
  const { data: reports, isLoading: reportsLoading } = useReports();

  if (analyticsLoading || reportsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-[var(--color-destructive)]">
          {getErrorMessage(error, "Failed to load dashboard. Please try again.")}
        </p>
      </div>
    );
  }

  const chartData = (analytics?.scores || []).slice(0, 10).reverse().map((s, i) => ({
    name: `#${i + 1}`,
    score: s.score,
  }));

  const avgScore = analytics?.scores?.length
    ? (analytics.scores.reduce((s, r) => s + r.score, 0) / analytics.scores.length).toFixed(1)
    : "—";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/interview/setup">New Interview</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <TrendingUp className="h-5 w-5 text-[var(--color-primary)]" />
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgScore}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Target className="h-5 w-5 text-[var(--color-primary)]" />
            <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.totalInterviews ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Award className="h-5 w-5 text-[var(--color-primary)]" />
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {analytics?.scores?.length ? Math.max(...analytics.scores.map((s) => s.score)) : "—"}%
            </p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card className="mb-8">
          <CardHeader><CardTitle>Score Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {analytics?.typeBreakdown && (
        <Card className="mb-8">
          <CardHeader><CardTitle>Score by Interview Type</CardTitle></CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            {Object.entries(analytics.typeBreakdown).map(([type, score]) => (
              score !== null && (
                <Badge key={type} variant="secondary" className="text-sm px-4 py-2 capitalize">
                  {type}: {score}%
                </Badge>
              )
            ))}
          </CardContent>
        </Card>
      )}

      {analytics?.weakestTopics?.length > 0 && (
        <Card className="mb-8">
          <CardHeader><CardTitle>Areas to Improve</CardTitle></CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            {analytics.weakestTopics.map(({ topic, count }) => (
              <Badge key={topic} variant="outline">{topic} ({count})</Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {analytics?.lastThree?.length > 0 && (
        <Card className="mb-8">
          <CardHeader><CardTitle>Recent Interviews Comparison</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analytics.lastThree.map((item) => (
                <div key={item.id} className="rounded-lg border border-[var(--color-border)] p-4">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-2xl font-bold text-[var(--color-primary)]">{item.score}%</p>
                  <p className="text-xs text-[var(--color-muted)] capitalize">{item.type}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Past Interviews</CardTitle></CardHeader>
        <CardContent>
          {!reports?.length ? (
            <div className="text-center py-8">
              <p className="text-[var(--color-muted)] mb-4">No interviews yet. Start your first one!</p>
              <Button asChild><Link to="/interview/setup">Create Interview</Link></Button>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report._id} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-4">
                  <div>
                    <p className="font-medium">{report.interviewId?.interview_name || "Interview"}</p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {report.finalScore != null && (
                      <Badge>{report.finalScore}%</Badge>
                    )}
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/interview/report/${report.interviewId?._id || report.interviewId}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
