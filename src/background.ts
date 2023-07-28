import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { Schedule, Site } from "@/dto";

dayjs.extend(customParseFormat);

chrome.action.onClicked.addListener(() => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL("options.html"));
    }
});

const getSite = async (url?: string) => {
    const hostName = url ? new URL(url).hostname : null;
    if (!hostName) return;

    const siteSettings = (await chrome.storage.local.get("sites")) as {
        sites: Site[];
    };

    if (!siteSettings.sites) return;

    const site = siteSettings.sites.find((site) => {
        const blockedURL = new URL(site.site);

        if (!site.exact) {
            return blockedURL.hostname == hostName;
        }

        return site.site == url;
    });

    return site;
};

const isInSchedule = async () => {
    const schedulesSettings = (await chrome.storage.local.get("schedules")) as {
        schedules: Schedule[];
    };

    const { schedules } = schedulesSettings;

    if (!schedules || schedules.length === 0) {
        return true;
    }

    const now = dayjs();
    const weekDay = now.get("day");

    const schedule = schedules.find((schedule) => {
        if (!schedule.weekDays.includes(weekDay)) {
            return false;
        }

        const startTime = dayjs(schedule.timeFrom, "HH:mm");
        const endTime = dayjs(schedule.timeTo, "HH:mm");

        return now.isAfter(startTime) && now.isBefore(endTime);
    });

    return schedule != undefined;
};

chrome.tabs.onUpdated.addListener(async (_, changeInfo, tab) => {
    if (tab.id == undefined) return;

    const url = changeInfo.url || tab.pendingUrl || tab.url;

    const enabledSettings = await chrome.storage.local.get("enabled");
    if (!enabledSettings.enabled) return;

    const site = await getSite(url);
    const inSchedule = await isInSchedule();

    if (site && inSchedule) {
        chrome.tabs.update(tab.id, { url: "blocked.html" });
    }
});
