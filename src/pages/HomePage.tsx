import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { RoomCheckInForm } from "@/components/RoomCheckInForm";
import { DailySummaryTable } from "@/components/DailySummaryTable";
import { BreakfastSession, Room } from "@shared/types";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
const getTodayDateString = () => format(new Date(), "yyyy-MM-dd");
export function HomePage() {
  const [session, setSession] = useState<BreakfastSession | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const todayDateString = getTodayDateString();
  const todayDisplayDate = format(new Date(), "eeee d MMMM yyyy", { locale: fr });
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [roomsData, sessionData] = await Promise.all([
        api<Room[]>("/api/rooms"),
        api<BreakfastSession>(`/api/sessions/${todayDateString}`),
      ]);
      setRooms(roomsData);
      setSession(sessionData);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      toast.error("Erreur lors du chargement des données. Veuillez rafraîchir la page.");
    } finally {
      setIsLoading(false);
    }
  }, [todayDateString]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleCheckIn = async ({ roomNumber }: { roomNumber: string }) => {
    setIsSubmitting(true);
    try {
      const room = rooms.find((r) => r.number.toLowerCase() === roomNumber.trim().toLowerCase());
      if (!room) {
        toast.error(`La chambre "${roomNumber}" n'existe pas.`);
        return;
      }
      const updatedSession = await api<BreakfastSession>(`/api/sessions/${todayDateString}/check-in`, {
        method: "POST",
        body: JSON.stringify({ roomId: room.id, roomNumber: room.number }),
      });
      setSession(updatedSession);
      toast.success(`Chambre ${room.number} validée.`);
    } catch (error) {
      const errorMessage = (error as Error).message || "Une erreur est survenue.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }
  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={itemVariants}>
        <h1 className="text-4xl font-bold font-display capitalize">{todayDisplayDate}</h1>
        <p className="text-lg text-muted-foreground">Enregistrez les clients pour le service du petit-déjeuner.</p>
      </motion.header>
      <motion.section variants={itemVariants}>
        <RoomCheckInForm onSubmit={handleCheckIn} isSubmitting={isSubmitting} />
      </motion.section>
      <motion.section variants={itemVariants}>
        <DailySummaryTable checkIns={session?.checkIns ?? []} />
      </motion.section>
    </motion.div>
  );
}