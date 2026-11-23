import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Clock, BookOpen, Calculator } from 'lucide-react';
import { Container, Badge, Spinner, EmptyState } from '../components/ui';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image?: string;
  read_time?: number;
  author?: string;
  created_at?: string;
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles?slug=${encodeURIComponent(slug ?? '')}`)
      .then((r) => r.json())
      .then((d) => setArticle(Array.isArray(d) && d.length ? d[0] : null))
      .catch(() => setArticle(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner />;
  if (!article) return <div className="py-12"><Container><EmptyState title="المقال غير موجود" action={<Link to="/knowledge" className="text-teal-600 hover:underline">العودة إلى مركز المعرفة</Link>} /></Container></div>;

  const paragraphs = (article.content || '').split(/\n+/).filter(Boolean);

  return (
    <div className="py-10">
      <Container>
        <Link to="/knowledge" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
          <ArrowRight className="h-4 w-4" /> مركز المعرفة
        </Link>

        <article className="mx-auto mt-6 max-w-3xl">
          <div className="flex items-center gap-2">
            <Badge color="teal">{article.category}</Badge>
            {article.read_time && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3 w-3" /> {article.read_time} دقيقة قراءة
              </span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900">{article.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-500">{article.excerpt}</p>

          {article.cover_image && (
            <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
              <img src={article.cover_image} alt={article.title} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="mt-8 space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-loose text-slate-700">{p}</p>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-teal-100 bg-teal-50 p-6">
            <h3 className="flex items-center gap-2 text-base font-bold text-teal-800">
              <Calculator className="h-5 w-5" /> طبّق ما تعلمته
            </h3>
            <p className="mt-2 text-sm text-teal-700">جرّب حاسبة المنظومات الهندسية لتصميم منظومتك بناءً على احتياجك الفعلي.</p>
            <Link to="/calculator" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
              ابدأ الحساب الآن
            </Link>
          </div>

          {article.author && (
            <div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <BookOpen className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{article.author}</p>
                <p className="text-xs text-slate-400">فريق طاقة بلس الهندسي</p>
              </div>
            </div>
          )}
        </article>
      </Container>
    </div>
  );
}