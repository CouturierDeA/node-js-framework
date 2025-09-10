import GSX from '../framework/gsx';

export type HtmlPageProps = {
    title: string;
    lang?: string;
    charset?: string;
    scripts?: string[];
}

export function HtmlPage(
    props: HtmlPageProps,
    ...content: typeof GSX[]
) {
    const { title, lang, charset, scripts } = props || {}
    return (
        <html lang={lang || 'en'}>
        <head>
            <meta charSet={charset || 'utf-8'}/>
            <title>{title}</title>
            <link rel="stylesheet" href="/styles.css"/>
            { scripts?.map(script => (<script type="module" src={script} />)) }
        </head>
        <body>{content}</body>
        </html>
    )
}

export function ErrorPage(
    props: HtmlPageProps,
    ...content: typeof GSX[]
) {
    return <HtmlPage {...props}>
        {...content}
    </HtmlPage>
}

export function GoTo({ to }: { to: string}, content?: typeof GSX) {
    return <div>
        <a href={to}>{ content || 'Go back' }</a>
    </div>
}

