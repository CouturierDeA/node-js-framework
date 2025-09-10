import GSX from '../framework/gsx';
import {GoTo, HtmlPage, HtmlPageProps} from "./default";

export function TodoPage(
    props: HtmlPageProps,
    ...content: typeof GSX[]
) {
    return (
        <HtmlPage {...props} scripts={['/todo.js']}>
            <GoTo to="/"/>
            {...content}
        </HtmlPage>
    )
}
