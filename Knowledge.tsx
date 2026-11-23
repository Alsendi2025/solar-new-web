import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock } from 'lucide-react';
import { Container, SectionHeading, Badge, Spinner, EmptyState } from '../components/ui';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  cover_image?: string;
  read_time?: number;
  created_at?: string;
}

const CATEGORIES = [
  { value: 'all', label: 'الكل' },
  { value: 'أساسيات الطاقة الشمسية', label: 'أساسيات' },
  { value: 'تصميم المنظومات', label: 'تصميم' },
  { value: 'البطاريات والتخزين', label: 'البطاريات' },
  { value: 'العواكس والمنظمات', label: 'العواكس' },
  { value: 'صيانة وتشغيل', label: 'صيانة' },
];

export default function Knowledge() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('all');

  useEffect(() => {
    setLoading(true);
    const url = cat === 'all' ? '/api/articles' : `/api/articles?category=${encodeURIComponent(cat)}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => setArticles(Array.isArray(d) ? d : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [cat]);

  return (
    <div className="py-12">
      <Container>
        <SectionHeading
          eyebrow="مركز المعرفة"
          title="محتوى فني واستشاري وتعليمي موثوق"
          description="مقالات وأدلة عملية في الطاقة الشمسية، تصميم المنظومات، البطاريات، والعواكس — بلغة هندسية واضحة."
        />

        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                cat === c.value ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-teal-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading ? (
            <Spinner />
          ) : articles.length === 0 ? (
            <EmptyState title="لا توجد مقالات في هذا القسم بعد" description="سيتم إضافة محتوى فني جديد قريباً." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <Link key={a.id} to={`/knowledge/${a.slug}`} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md">
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    {a.cover_image ? (
                      <img src={a.cover_image} alt={a.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300"><BookOpen className="h-10 w-10" /></div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <Badge color="teal">{a.category}</Badge>
                      {a.read_time && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" /> {a.read_time} دقيقة
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-base font-bold text-slate-800 group-hover:text-teal-700">{a.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-slate-500">{a.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}