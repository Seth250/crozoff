from dateutil import relativedelta


def format_value(value, unit):
	value = int(value)
	return f"{value} {unit}{'s' if value != 1 else ''}"

def get_date_time_diff(dt1, dt2):
	rel = relativedelta.relativedelta(dt1, dt2)
	if rel.years:
		return format_value(rel.years, 'Year')

	elif rel.months:
		return format_value(rel.months, 'Month')

	elif rel.weeks:
		return format_value(rel.weeks, 'Week')

	elif rel.days:
		return format_value(rel.days, 'Day')

	elif rel.hours:
		return format_value(rel.hours, 'Hour')

	elif rel.minutes:
		return format_value(rel.minutes, 'Minute')

	else:
		return format_value(rel.seconds, 'Second')
		