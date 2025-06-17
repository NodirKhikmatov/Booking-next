export interface Question {
	id: string;
	title: string;
	description: string;
	category: string;
	status: 'pending' | 'answered' | 'closed';
	createdAt: string;
	updatedAt: string;
	attachments?: string[];
}

export interface FAQ {
	id: string;
	question: string;
	answer: string;
	category: string;
	tags: string[];
}

export interface Notice {
	id: string;
	title: string;
	content: string;
	priority: 'info' | 'warning' | 'error' | 'success';
	date: string;
}

export interface ContactForm {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export interface QuestionForm {
	title: string;
	description: string;
	category: string;
	attachments?: File[];
}
