/**
 * External dependencies
 */
import debugFactory from 'debug';

// Maximum number of characters we send from the content
export const MAXIMUM_NUMBER_OF_CHARACTERS_SENT_FROM_CONTENT = 1024;

const debug = debugFactory( 'jetpack-ai-assistant:prompt' );

/*
 * Builds a prompt template based on context, rules and content
 *
 * @param {object} options         - The prompt options.
 * @param {string} options.context - The expected context to the prompt, e.g. "You are...".
 * @param {array} options.rules    - An array of rules to be followed.
 * @param {string} options.request - The prompt request.
 * @param {string} options.content - The content to be modified.
 *
 * @return {string} The prompt.
 */
export const buildPromptTemplate = ( {
	context = 'You are an AI assistant block, a part of a product called Jetpack made by the company called Automattic',
	rules = [],
	request = null,
	content = null,
} ) => {
	if ( ! request && ! content ) {
		throw new Error( 'You must provide either a request or content' );
	}

	let job = 'Your job is to ';

	if ( !! request && ! content ) {
		job += 'respond to the request below, under "Request"';
	} else if ( ! request && !! content ) {
		job += 'modify the content below, under "Content"';
	} else {
		job +=
			'modify the content shared below, under "Content", based on the request below, under "Request"';
	}

	const requestText = ! request
		? ''
		: `\nRequest:
${ request }`;

	const contentText = ! content
		? ''
		: `\nContent:
${ content }`;

	const prompt = `${ context }.
${ job }. Do this by following rules set in "Rules".

Rules:
- Output the generated content in markdown format.
- Do not include a top level heading by default.
- Only output generated content ready for publishing.${ rules.length ? '\n' : '' }${ rules
		.map( rule => `- ${ rule }.` )
		.join( '\n' ) }
${ requestText }${ requestText && contentText ? `\n${ contentText }` : contentText }`;

	debug( prompt );
	return prompt;
};

export function buildPrompt( {
	content,
	contentFromBlocks,
	currentPostTitle,
	partialContentAsBlock,
	options,
	prompt,
	type,
	userPrompt,
} ) {
	switch ( type ) {
		/*
		 * Generate content from title.
		 */
		case 'titleSummary':
			prompt = buildPromptTemplate( {
				request: 'Please help me write a short piece for a blog post based on the content below',
				content: currentPostTitle,
			} );
			break;

		/*
		 * Continue generating from the content below.
		 */
		case 'continue':
			prompt = buildPromptTemplate( {
				request: 'Please continue writing from the content below.',
				rules: [ 'Only output the continuation of the content, without repeating it' ],
				content: partialContentAsBlock,
			} );
			break;

		/*
		 * Change the tone of the content.
		 */
		case 'changeTone':
			prompt = buildPromptTemplate( {
				request: `Please, rewrite with a ${ options.tone } tone.`,
				content,
			} );
			break;

		/*
		 * Summarize the content.
		 */
		case 'summarize':
			prompt = buildPromptTemplate( {
				request: 'Summarize the content below.',
				content: content?.length ? content : contentFromBlocks,
			} );
			break;

		/*
		 * Make the content longer.
		 */
		case 'makeLonger':
			prompt = buildPromptTemplate( {
				request: 'Make the content below longer.',
				content,
			} );
			break;

		/*
		 * Make the content shorter.
		 */
		case 'makeShorter':
			prompt = buildPromptTemplate( {
				request: 'Make the content below shorter.',
				content,
			} );
			break;

		/*
		 * Generate a title for this blog post, based on the content.
		 */
		case 'generateTitle':
			prompt = buildPromptTemplate( {
				request: 'Generate a title for this blog post',
				rules: [ 'Only output the raw title, without any prefix or quotes' ],
				content: content?.length ? content : contentFromBlocks,
			} );
			break;

		/*
		 * Simplify the content.
		 */
		case 'simplify':
			prompt = buildPromptTemplate( {
				request: 'Simplify the content below.',
				rules: [
					'Use words and phrases that are easier to understand for non-technical people',
					'Output in the same language of the content',
					'Use as much of the original language as possible',
				],
				content: content?.length ? content : contentFromBlocks,
			} );
			break;

		/**
		 * Correct grammar and spelling
		 */
		case 'correctSpelling':
			prompt = buildPromptTemplate( {
				request: 'Correct any spelling and grammar mistakes from the content below.',
				content: content?.length ? content : contentFromBlocks,
			} );
			break;

		/**
		 * Change the language, based on options.language
		 */
		case 'changeLanguage':
			prompt = buildPromptTemplate( {
				request: `Please, rewrite in the following language: ${ options.language }`,
				content: content?.length ? content : contentFromBlocks,
			} );
			break;

		default:
			prompt = buildPromptTemplate( {
				request: userPrompt,
				content,
			} );
			break;
	}
	return prompt;
}
