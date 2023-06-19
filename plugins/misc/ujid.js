/**
 Copyright (C) 2022.
 Licensed under the  GPL-3.0 License;
 You may not use this file except in compliance with the License.
 It is supplied in the hope that it may be useful.
 * @project_name : Secktor-Md
 * @author : SamPandey001 <https://github.com/SamPandey001>
 * @description : Secktor,A Multi-functional whatsapp bot.
 * @version 0.0.6
 **/

const { tlang, ringtone, cmd,fetchJson, sleep, botpic,ffmpeg, getBuffer, pinterest, prefix, Config } = require('../lib')
const { mediafire } = require("../lib/mediafire.js");
const googleTTS = require("google-tts-api");
const ytdl = require('ytdl-secktor')
const fs = require('fs-extra')
var videotime = 60000 // 1000 min
var dlsize = 1000 // 1000mb
    //---------------------------------------------------------------------------
cmd({
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

cmd({
		pattern: 'yta ?(.*)',
		fromMe: true,
		desc: 'Download youtube audio',
		type: 'download',
	},
	async (message, match) => {
		match = match || message.reply_message.text
		if (!match) return await message.send('_Example : yta darari/yt url_')
		const vid = ytIdRegex.exec(match)
		if (vid) match = vid[1]
		const [video] = await yts(match, !!vid)
		const { title, thumbnail, id } = video
		const audio = await y2mate.get(id)
		const result = await y2mate.dl(id, 'audio')
		if (!result)
			return await message.send(`_not found._`, { quoted: message.data })
		const { buffer } = await getBuffer(result)
		if (!buffer) return await message.send(result, { quoted: message.data })
		return await message.send(
			await addAudioMetaData(buffer, title, '', '', thumbnail),
			{ quoted: message.data, mimetype: 'audio/mpeg' },
			'audio'
		)
	}
)
