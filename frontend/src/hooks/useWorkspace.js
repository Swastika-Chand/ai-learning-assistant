import { useState } from "react";

export default function useWorkspace() {
  const [selectedWorkspace,
    setSelectedWorkspace] = useState(null);

  const [notes, setNotes] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  return {
    selectedWorkspace,
    setSelectedWorkspace,
    notes,
    setNotes,
    answer,
    setAnswer,
  };
}