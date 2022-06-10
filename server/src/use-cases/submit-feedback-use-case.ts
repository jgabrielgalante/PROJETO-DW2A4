import { MailAdapter } from '../adapters/mail-adapter';
import { FeedbacksRepository } from '../repositories/feedbacks-repository';

interface SubmitFeedbackUseCaseRequest {
    type: string;
    comment: string;
    screenshot?: string;
    date: string;
    name?: string;
}

export class SubmitFeedbackUseCase {
    constructor(
        private feedbacksRepository: FeedbacksRepository,
        private mailAdapter: MailAdapter,
    ) { }

    async execute(request: SubmitFeedbackUseCaseRequest) {
        const { type, comment, screenshot, date, name } = request;

        if (!type) {
            throw new Error('Type is required.');
        }

        if (!comment) {
            throw new Error('Comment is required.');
        }

        if (screenshot && !screenshot.startsWith('data:image/png;base64')) {
            throw new Error('Invalid screenshot format.');
        }

        if(!date) {
            throw new Error('Date is required');
        }

        await this.feedbacksRepository.create({
            type,
            comment,
            screenshot,
            date,
            name,
        })

        await this.mailAdapter.sendMail({
            subject: `Novo feedback [${type}]`,
            body: [
                `<div style="font-family: sans-serif; font-size: 16px; color:#111">`,
                `<p>Feedback</p>`,
                `<p>Tipo: ${type}</p>`,
                `<p>Comentário: ${comment}</p>`,
                `<p>Comentário: ${name}</p>`,
                `<p>Data: ${date}</p>`,
                screenshot
                    ?
                    [`<p>Screenshot: ${screenshot}</p><br>`,
                    `<img src="${screenshot}" width="500"`,
                    ]
                    :
                    '',
                `</div>`,

            ].join('\n')
        })
    }
}