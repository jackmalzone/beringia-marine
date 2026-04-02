import Link from 'next/link';
import { ArticleData, getCategoryColor } from '@/types/insights';
import { calculateReadingTime } from '@/lib/data/insights';
import heroStyles from '@/components/insights/ArticleHero/ArticleHero.module.css';
import contentStyles from '@/components/insights/ArticleContent/ArticleContent.module.css';

interface ArticleBodyServerProps {
  article: ArticleData;
}

export default function ArticleBodyServer({ article }: ArticleBodyServerProps) {
  const categoryColor = getCategoryColor(article.category);
  const readingTime = article.readingTime || calculateReadingTime(article.content);
  const publishDate = new Date(article.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const authorName = typeof article.author === 'string' ? article.author : article.author.name;

  const heroStyle =
    article.heroImage && !article.heroImageSplit
      ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${article.heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      : undefined;

  return (
    <main data-seo-main>
      <section className={heroStyles.hero} style={heroStyle}>
        {article.heroImageSplit ? (
          <>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                backgroundImage: `url(${article.heroImageSplit.left})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(100%)',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '50%',
                height: '100%',
                backgroundImage: `url(${article.heroImageSplit.right})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'grayscale(100%)',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7))',
                zIndex: 1,
              }}
            />
          </>
        ) : null}

        <div className={heroStyles.hero__content}>
          <Link href="/insights" className={heroStyles.hero__backLink}>
            Back to Insights
          </Link>

          <div className={heroStyles.hero__meta}>
            <span className={heroStyles.hero__category} style={{ backgroundColor: categoryColor }}>
              {article.category}
            </span>
            <span className={heroStyles.hero__date}>{publishDate}</span>
            <span className={heroStyles.hero__readingTime}>{readingTime} min read</span>
          </div>

          <h1 className={heroStyles.hero__title}>{article.title}</h1>
          <p className={heroStyles.hero__subtitle}>{article.subtitle}</p>

          <p className={heroStyles.hero__subtitle}>By {authorName}</p>

          {article.tags.length > 0 ? (
            <div className={heroStyles.hero__tags}>
              {article.tags.map((tag) => (
                <span key={tag} className={heroStyles.hero__tag}>
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <article className={contentStyles.content}>
        <div className={contentStyles.content__container}>
          <div className={contentStyles.content__body} dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </article>
    </main>
  );
}
