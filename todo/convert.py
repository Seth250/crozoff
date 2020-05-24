
def format_time(time, unit):
	time = int(time)
	return f"{time} {unit}{'s' if time > 1 else ''}"

def convert_date_time(date_time):
	date_time = str(date_time).split(",")
	if len(date_time) > 1:
		return date_time[0]

	else:
		time = date_time[0].split(":")
		if int(time[0]) != 0:
			return format_time(time[0], 'Hour')

		elif int(time[1]) != 0:
			return format_time(time[1], 'Minute')

		else:
			return format_time(time[2][:2], 'Second')