const {
	y2mate,
	bot,
	getBuffer,
	genButtonMessage,
	addAudioMetaData,
	yts,
} = require('../lib/')
const ytIdRegex =
	/(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed|shorts\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/

cmd(
	{
		pattern: 'ytv ?(.*)',
		fromMe: true,
		desc: 'Download youtube video',
		type: 'download',
	},
	async (message, match) => {
		match = match || message.reply_message.text
		if (!match) return await message.send('_Example : ytv url_')
		if (match.startsWith('y2mate;')) {
			const [_, q, id] = match.split(';')
			const result = await y2mate.dl(id, 'video', q)
			return await message.sendFromUrl(result)
		}
		if (!ytIdRegex.test(match))
			return await message.send('*Give me a yt link!*', {
				quoted: message.data,
			})
		const vid = ytIdRegex.exec(match)
		const { title, video, thumbnail, time } = await y2mate.get(vid[1])
		const buttons = []
		for (const q in video)
			buttons.push({
				text: `${q}(${video[q].fileSizeH || video[q].size})`,
				id: `ytv y2mate;${q};${vid[1]}`,
			})
		if (!buttons.length)
			return await message.send('*Not found*', {
				quoted: message.quoted,
			})
		return await message.send(
			await genButtonMessage(
				buttons,
				title,
				time,
				{ image: thumbnail },
				message
			),
			{},
			'button'
		)
	}
)
