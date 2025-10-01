import { CheckIn } from "@shared/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, FileDown } from "lucide-react";
interface HistoryReportProps {
  date: string;
  checkIns: CheckIn[];
}
export function HistoryReport({ date, checkIns }: HistoryReportProps) {
  const formattedDate = format(new Date(date), "eeee d MMMM yyyy", { locale: fr });
  const sortedCheckIns = [...checkIns].sort((a, b) => a.timestamp - b.timestamp);
  const handlePrint = () => {
    window.print();
  };

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
    const reportDate = format(new Date(date), "yyyy-MM-dd");
    link.setAttribute("download", `rapport_petit-dejeuner_${reportDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="print:shadow-none print:border-none">
      <CardHeader>
        <CardTitle className="capitalize text-2xl font-bold font-display">{formattedDate}</CardTitle>
        <CardDescription>
          Total de <span className="font-bold text-primary">{checkIns.length}</span> clients servis ce jour-là.
        </CardDescription>
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
              {sortedCheckIns.length > 0 ? (
                sortedCheckIns.map((checkIn) => (
                  <TableRow key={checkIn.roomId}>
                    <TableCell className="font-medium">{checkIn.roomNumber}</TableCell>
                    <TableCell>{format(new Date(checkIn.timestamp), "HH:mm:ss", { locale: fr })}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                    Aucun client n'a été servi à cette date.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="justify-end no-print space-x-2">
        <Button onClick={handleExport} disabled={checkIns.length === 0} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Exporter (Excel)
        </Button>
        <Button onClick={handlePrint} disabled={checkIns.length === 0}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimer le rapport
        </Button>
      </CardFooter>
    </Card>
  );
}