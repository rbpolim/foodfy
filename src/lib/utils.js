module.exports = {
	date(timestamp){
		const date = new Date(timestamp);

		const year = date.getUTCFullYear();  //yyyy
		const month = `0${date.getUTCMonth() + 1}`.slice(-2); //mm
		const day = `0${date.getUTCDate()}`.slice(-2);  //dd

		return {
			day,
			month,
			year,
			iso: `${year}-${month}-${day}`,
			birthDay: `${day}/${month}`,
			format: `${day}/${month}/${year}`
		};
	},
};
