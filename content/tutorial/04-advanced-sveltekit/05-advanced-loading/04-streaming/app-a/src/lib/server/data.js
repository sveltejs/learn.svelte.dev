export function getSummaries() {
	return posts.map((post) => ({
		slug: post.slug,
		title: post.title
	}));
}

export function getPost(slug) {
	const post = posts.find((post) => post.slug === slug);

	if (post) {
		return {
			slug: post.slug,
			title: post.title,
			content: post.content
		};
	}
}

export async function getComments(slug) {
	// simulate delay
	await new Promise((fulfil) => setTimeout(fulfil, 1000));

	const post = posts.find((post) => post.slug === slug);
	return post?.comments;
}

const posts = [
	{
		slug: 'welcome',
		title:
			'Welcome to the Aperture Science computer-aided enrichment center',
		content:
			'<p>We hope your brief detention in the relaxation vault has been a pleasant one.</p><p>Your specimen has been processed and we are now ready to begin the test proper.</p>',
		comments: [
			{
				author: 'GLaDOS',
				content: "This cake is great! It's so delicious and moist!"
			},
			{
				author: 'Doug',
				content: 'The cake is a lie'
			}
		]
	},

	{
		slug: 'safety',
		title: 'Safety notice',
		content:
			'<p>While safety is one of many Enrichment Center Goals, the Aperture Science High Energy Pellet, seen to the left of the chamber, can and has caused permanent disabilities, such as vaporization. Please be careful.</p>',
		comments: [
			{
				author: 'Cave',
				content: "Science isn't about WHY, it's about WHY NOT!"
			}
		]
	},

	{
		slug: 'cake',
		title: 'This was a triumph',
		content: "<p>I'm making a note here: HUGE SUCCESS.</p>",
		comments: [
			{
				author: 'GLaDOS',
				content: "It's hard to overstate my satisfaction."
			},
			{
				author: 'GLaDOS',
				content: 'Aperture Science. We do what we must because we can.'
			}
		]
	}
];