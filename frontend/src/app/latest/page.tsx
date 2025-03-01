"use client";

import React from "react";
import { useState, useEffect, memo } from "react";
import { fetchGraphQL } from "../../utils/graphql";

import { MovieProps } from "../../lib/types";
import ContentRow from "../../components/ContentRow";

import {
  COMING_NEXT_WEEEK,
  COMING_THIS_WEEEK,
  NEW_CONTENT,
  TOP_10_QUERY,
} from "../../graphql/queries";
import ShimmerUI from "../../components/layout/ShimmerUI";

const MemoizedContentRow = memo(ContentRow);

const LastestPage = () => {
  const [top10, setTop10] = useState<MovieProps[]>([]);
  const [contentWeek, setContentWeek] = useState<MovieProps[]>([]);
  const [contentNextWeek, setContentNextWeek] = useState<MovieProps[]>([]);
  const [newContent, setNewContent] = useState<MovieProps[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const top10Data = await fetchGraphQL(TOP_10_QUERY);
        setTop10(top10Data.top10);

        const contentWeekData = await fetchGraphQL(COMING_THIS_WEEEK);
        setContentWeek(contentWeekData.comingThisWeek);

        const contentNextWeekData = await fetchGraphQL(COMING_NEXT_WEEEK);
        setContentNextWeek(contentNextWeekData.comingNextWeek);

        const newContentData = await fetchGraphQL(NEW_CONTENT);
        setNewContent(newContentData.newContent);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <ShimmerUI />;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="pt-10">
      {contentWeek.length > 0 && (
        <MemoizedContentRow movies={contentWeek} title="Coming This Week" />
      )}

      {contentNextWeek.length > 0 && (
        <MemoizedContentRow movies={contentNextWeek} title="Coming Next Week" />
      )}

      {top10.length > 0 && (
        <MemoizedContentRow
          movies={top10.slice(0, 10)}
          title="Top 10 Movies in U.S. Today"
          top10={true}
        />
      )}

      {newContent.length > 0 && (
        <MemoizedContentRow movies={newContent} title="New Content" />
      )}

      {top10.length > 10 && (
        <MemoizedContentRow
          movies={top10.slice(0, 10)}
          title="Top 10 Shows in U.S. Today"
          top10={true}
        />
      )}
    </div>
  );
};

export default LastestPage;
