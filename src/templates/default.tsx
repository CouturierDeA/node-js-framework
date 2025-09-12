import TSX from '../framework/tsx';

export type HtmlPageProps = {
    title: string;
    lang?: string;
    charset?: string;
    scripts?: string[];
};

export function HtmlPage(props: HtmlPageProps, ...content: (typeof TSX)[]) {
    const { title, lang, charset, scripts } = props || {};
    return (
        <html lang={lang || 'en'}>
            <head>
                <meta charSet={charset || 'utf-8'} />
                <title>{title}</title>
                <link rel="stylesheet" href="/styles.css" />
                {scripts?.map((script) => (
                    <script type="module" src={script} />
                ))}
            </head>
            <body>{content}</body>
        </html>
    );
}

export function ErrorPage(props: HtmlPageProps, ...content: (typeof TSX)[]) {
    return <HtmlPage {...props}>{...content}</HtmlPage>;
}

export function GoTo({ to }: { to: string }, content?: typeof TSX) {
    return (
        <div>
            <a href={to}>{content || 'Go back'}</a>
        </div>
    );
}
