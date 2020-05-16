import moment from 'moment'
import { useEffect } from 'react'

export function showCookie(name) {
    if (document.cookie !== "") {
        const cookies = document.cookie.split(/; */);

        for (let i = 0; i < cookies.length; i++) {
            const cookieName = cookies[i].split("=")[0];
            const cookieVal = cookies[i].split("=")[1];
            if (cookieName === decodeURIComponent(name)) {
                return decodeURIComponent(cookieVal);
            }
        }
    }
}

export function deleteCookie(name) {
    const cookieName = encodeURIComponent(name);
    document.cookie = cookieName + '=;';
}

export function isNull(obj) {
    if (Object.keys(obj).length > 0) {
        return true
    }
    return false
}

export function getDayOfWeek(date) {
    const day = date.split(',')[0]

    switch (day) {
        case 'Niedziela':
            return 0
        case 'Poniedziałek':
            return 1
        case 'Wtorek':
            return 2
        case 'Środa':
            return 3
        case 'Czwartek':
            return 4
        case 'Piątek':
            return 5
        case 'Sobota':
            return 6
    }
}

export function getClosestDay(dayNeeded) {
    const today = moment().isoWeekday()

    if (dayNeeded) {
        if (today <= dayNeeded) {
            return moment().isoWeekday(dayNeeded)
        } else {
            return moment().add(1, 'weeks').isoWeekday(dayNeeded)
        }
    } else return moment()
}

export function useEffectIf(condition, fn) {
    useEffect(() => condition && fn(), [condition])
}