import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIn } from "@shared/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface DailySummaryTableProps {
  checkIns: CheckIn[];
}

export function DailySummaryTable({ checkIns }: DailySummaryTableProps) {
  const sortedCheckIns = [...checkIns].sort((a, b) => b.timestamp - a.timestamp);

  const handleExport = () => {
    const headers = ["Chambre", "Heure de passage"];
    const rows = sortedCheckIns.map((checkIn) => [
      checkIn.roomNumber,
      format(new Date(checkIn.timestamp), "HH:mm:ss", { locale: fr }),
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const formattedDate = format(new Date(), "yyyy-MM-dd");
    link.setAttribute("download", `rapport-petit-dejeuner-${formattedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-4">
          <CardTitle className="text-2xl font-bold">Suivi du jour</CardTitle>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={checkIns.length === 0}>
            Exporter (Excel)
          </Button>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-4xl font-bold text-accent">{checkIns.length}</div>
          <p className="text-xs text-muted-foreground">clients servis</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] overflow-y-auto rounded-md border">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead className="w-[200px]">Chambre</TableHead>
                <TableHead>Heure de passage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {sortedCheckIns.length > 0 ? (
                  sortedCheckIns.map((checkIn) => (
                    <motion.tr
                      key={checkIn.roomId}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="m-0 p-0"
                    >
                      <TableCell className="font-medium">{checkIn.roomNumber}</TableCell>
                      <TableCell>{format(new Date(checkIn.timestamp), "HH:mm:ss", { locale: fr })}</TableCell>
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                      Aucun client servi pour le moment.
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}