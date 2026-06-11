import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExternalLink } from "lucide-react";

const resources = [
  { title: "LeetCode", url: "https://leetcode.com", category: "Coding", desc: "Practice coding problems" },
  { title: "Pramp", url: "https://www.pramp.com", category: "Mock Interviews", desc: "Peer mock interviews" },
  { title: "Glassdoor", url: "https://www.glassdoor.com", category: "Company Research", desc: "Interview questions by company" },
  { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", category: "System Design", desc: "Learn system design basics" },
  { title: "STAR Method Guide", url: "https://www.themuse.com/advice/star-interview-method", category: "Behavioral", desc: "Structure behavioral answers" },
  { title: "Cracking the Coding Interview", url: "https://www.crackingthecodinginterview.com", category: "Books", desc: "Classic interview prep book" },
];

export default function Resources() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(resources.map((r) => r.category))];
  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || r.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Interview Resources</h1>
      <p className="text-[var(--color-muted)] mb-8">Curated tools to supplement your PrepEdge practice</p>

      <div className="flex gap-4 mb-8 flex-wrap">
        <Input placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <select className="flex h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <Card key={r.title}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                {r.title}
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)]">
                  <ExternalLink size={16} />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-xs bg-[var(--color-secondary)] px-2 py-0.5 rounded-full">{r.category}</span>
              <p className="text-sm text-[var(--color-muted)] mt-2">{r.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
