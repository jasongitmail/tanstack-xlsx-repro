import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import * as xlsx from "xlsx-js-style";

// Server function that uses xlsx
const generateXlsx = createServerFn({ method: "GET" }).handler(async () => {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet([["Hello", "World"]]);
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

  const buffer = xlsx.write(wb, { type: "array", bookType: "xlsx" });
  return { success: true, size: buffer.byteLength };
});

export const Route = createFileRoute("/api/xlsx")({
  server: {
    handlers: {
      GET: async () => {
        // Also call the server function
        const result = await generateXlsx();

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.aoa_to_sheet([["Hello", "World"]]);
        xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

        const buffer = xlsx.write(wb, { type: "array", bookType: "xlsx" });

        return new Response(buffer, {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        });
      },
    },
  },
});
