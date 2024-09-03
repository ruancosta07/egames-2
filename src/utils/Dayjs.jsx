import dayjs from "dayjs"
import "dayjs/locale/pt-br"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.locale("pt-br")
dayjs.extend(utc)
dayjs.extend(timezone)
export default dayjs