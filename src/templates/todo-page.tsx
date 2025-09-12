import TSX from '../framework/tsx';
import { GoTo, HtmlPage, HtmlPageProps } from './default';

export function TodoPage(props: HtmlPageProps, ...content: (typeof TSX)[]) {
    return (
        <HtmlPage {...props} scripts={['/todo.js']}>
            <GoTo to="/" />
            {...content}
        </HtmlPage>
    );
}
