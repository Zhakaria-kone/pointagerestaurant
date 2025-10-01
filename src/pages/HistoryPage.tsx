import { useState, useEffect } from "react";
import { api } from "@/lib/api-client";
import { BreakfastSession, SessionList } from "@shared/types";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HistoryReport } from "@/components/HistoryReport";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export function HistoryPage() {
  const [sessionDates, setSessionDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<BreakfastSession | null>(null);
  const [isLoadingDates, setIsLoadingDates] = useState(true);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  useEffect(() => {
    const fetchSessionDates = async () => {
      setIsLoadingDates(true);
      try {
        const data = await api<SessionList>("/api/sessions");
        // Sort dates descending
        const sortedDates = data.dates.sort((a, b) => b.localeCompare(a));
        setSessionDates(sortedDates);
      } catch (error) {
        toast.error("Erreur lors du chargement de l'historique.");
      } finally {
        setIsLoadingDates(false);
      }
    };
    fetchSessionDates();
  }, []);
  useEffect(() => {
    if (selectedDate) {
      const fetchSessionDetails = async () => {
        setIsLoadingSession(true);
        setSelectedSession(null);
        try {
          const sessionData = await api<BreakfastSession>(`/api/sessions/${selectedDate}`);
          setSelectedSession(sessionData);
        } catch (error) {
          toast.error(`Erreur lors du chargement de la session du ${selectedDate}.`);
        } finally {
          setIsLoadingSession(false);
        }
      };
      fetchSessionDetails();
    }
  }, [selectedDate]);
  const animationProps = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: "easeInOut" },
  } as const;
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-display">Historique</h1>
        <p className="text-lg text-muted-foreground">Consultez les services des jours précédents.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Sélectionner une date</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingDates ? (
            <Skeleton className="h-10 w-full md:w-1/3" />
          ) : sessionDates.length > 0 ? (
            <Select onValueChange={setSelectedDate} value={selectedDate ?? ""}>
              <SelectTrigger className="w-full md:w-1/3">
                <SelectValue placeholder="Choisissez une date dans l'historique" />
              </SelectTrigger>
              <SelectContent>
                {sessionDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
             <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg">
                <Calendar className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-semibold">Aucun historique disponible</p>
                <p className="text-muted-foreground">Aucune session de petit-déjeuner n'a encore été enregistrée.</p>
            </div>
          )}
        </CardContent>
      </Card>
      <AnimatePresence mode="wait">
        {isLoadingSession && (
          <motion.div key="loading" {...animationProps} className="space-y-4">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-96 w-full" />
          </motion.div>
        )}
        {!isLoadingSession && selectedDate && selectedSession && (
          <motion.div key={selectedDate} {...animationProps}>
            <HistoryReport date={selectedDate} checkIns={selectedSession.checkIns} />
          </motion.div>
        )}
        {!isLoadingSession && !selectedDate && !isLoadingDates && sessionDates.length > 0 && (
          <motion.div key="select-prompt" {...animationProps} className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed rounded-lg">
              <Search className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-semibold">Veuillez sélectionner une date</p>
              <p className="text-muted-foreground">Choisissez une date ci-dessus pour afficher le rapport détaillé.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}