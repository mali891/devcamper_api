const successHandler = (res, data = null, message = null) => {
	res.status(200).json({ success: true, message, data });
	console.log(message ? message.brightWhite.bold.underline : 'Success!'.brightWhite.bold.underline);
};

module.exports = successHandler;
