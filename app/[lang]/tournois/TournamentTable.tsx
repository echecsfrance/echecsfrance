"use client";

import { useEffect } from "react";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { twMerge } from "tailwind-merge";

import {
  debouncedHoveredListTournamentIdAtom,
  debouncedHoveredMapTournamentGroupIdAtom,
  filteredTournamentsListAtom,
  hoveredMapTournamentGroupIdAtom,
  normsOnlyAtom,
  syncVisibleAtom,
} from "@/app/atoms";
import { useBreakpoint } from "@/hooks/tailwind";

import ScrollToTopButton from "./ScrollToTopButton";
import SearchBar from "./SearchBar";
import TimeControlFilters from "./TimeControlFilters";

export default function TournamentTable() {
  const t = useTranslations("Tournaments");
  const at = useTranslations("App");

  const filteredTournaments = useAtomValue(filteredTournamentsListAtom);
  const [syncVisible, setSyncVisible] = useAtom(syncVisibleAtom);
  const [normsOnly, setNormsOnly] = useAtom(normsOnlyAtom);
  const hoveredMapTournamentGroupId = useAtomValue(
    hoveredMapTournamentGroupIdAtom,
  );
  const debouncedHoveredMapTournamentGroupId = useAtomValue(
    debouncedHoveredMapTournamentGroupIdAtom,
  );
  const setHoveredListTournamentId = useSetAtom(
    debouncedHoveredListTournamentIdAtom,
  );

  const isLg = useBreakpoint("lg");

  useEffect(() => {
    if (!isLg || debouncedHoveredMapTournamentGroupId === null) return;
    const tournamentRow = document.querySelector(
      `[data-group-id="${debouncedHoveredMapTournamentGroupId}"]`,
    );

    tournamentRow?.scrollIntoView({ behavior: "smooth" });
  }, [debouncedHoveredMapTournamentGroupId, isLg]);

  return (
    <section
      className="tournament-table grid w-full auto-rows-max pb-20 lg:col-start-2 lg:col-end-3 lg:h-content lg:overflow-y-scroll lg:pb-0"
      id="tournament-table"
      data-test="tournament-table-div"
    >
      <div className="z-10 flex w-full flex-wrap items-center justify-between gap-3 p-3">
        <SearchBar />

        <div className="flex flex-col gap-0 text-gray-900 dark:text-white">
          <label>
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 rounded border-gray-400 text-primary focus:ring-primary"
              checked={syncVisible}
              onChange={() => setSyncVisible(!syncVisible)}
            />
            {t("syncWithMapCheckbox")}
          </label>

          <label>
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 rounded border-gray-400 text-primary focus:ring-primary"
              checked={normsOnly}
              onChange={() => setNormsOnly(!normsOnly)}
            />
            {t("normsOnly")}
          </label>
        </div>

        <div className="hidden lg:block">
          <TimeControlFilters />
        </div>
      </div>

      <ScrollToTopButton />

      <div className="overflow-x-scroll">
        <table
          className="relative min-w-full table-fixed text-center text-xs lg:w-full"
          data-test="tournament-table"
        >
          <thead>
            <tr>
              <th className="sticky top-0 bg-primary-600 p-3 text-white dark:bg-gray-600">
                {t("date")}
              </th>
              <th className="sticky top-0 bg-primary-600 p-3 text-white dark:bg-gray-600">
                {t("town")}
              </th>
              <th className="sticky top-0 bg-primary-600 p-3 text-white dark:bg-gray-600">
                {t("tournament")}
              </th>
              <th className="sticky top-0 bg-primary-600 p-3 text-white dark:bg-gray-600">
                {t("timeControl")}
              </th>
              <th className="sticky top-0 w-[50px] bg-primary-600 p-3 text-white dark:bg-gray-600"></th>
            </tr>
          </thead>

          <tbody>
            {filteredTournaments.length === 0 ? (
              <tr className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                <td colSpan={4} className="p-3">
                  {t("noneFound")}
                </td>
              </tr>
            ) : (
              filteredTournaments.map((tournament) => (
                <tr
                  key={tournament.id}
                  id={tournament.id}
                  data-group-id={tournament.groupId}
                  onMouseEnter={() => setHoveredListTournamentId(tournament.id)}
                  onMouseLeave={() => setHoveredListTournamentId(null)}
                  className={twMerge(
                    "scroll-m-20 bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-900",
                    hoveredMapTournamentGroupId === tournament.groupId &&
                      "bg-gray-200 dark:bg-gray-900",
                  )}
                >
                  <td className="px-1 py-2 sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    {tournament.date}
                  </td>
                  <td className="px-1 py-2 sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    {tournament.town}
                  </td>
                  <td className="px-1 py-2 sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    <span>
                      {tournament.norm && (
                        <FaTrophy
                          className="mr-2 inline-block h-4 w-4"
                          data-norm="norm"
                        />
                      )}
                      {tournament.tournament}
                    </span>
                  </td>
                  <td className="px-1 py-2 sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    {at("timeControlEnum", { tc: tournament.timeControl })}
                  </td>
                  <td className="px-1 py-2 sm:px-3 sm:py-3 lg:px-3 lg:py-3">
                    <a href={tournament.url} target="_blank">
                      <FaExternalLinkAlt />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Tooltip anchorSelect="[data-norm='norm']">
        <div className="flex items-center">
          <FaTrophy className="mr-3 h-4 w-4" />
          {t("norm")}
        </div>
      </Tooltip>
    </section>
  );
}
