import schedule from 'node-schedule';
import User from "../models/scheduleUsers.js"

// Funzione per eliminare gli account non verificati dopo 24 ore
const deleteUnverifiedAccounts = async () => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    const result = await User.deleteMany({ isVerified: false, createdAt: { $lt: twentyFourHoursAgo } });
    console.log(`Eliminati ${result.deletedCount} account non verificati.`);
  } catch (error) {
    console.error('Errore durante l\'eliminazione degli account non verificati:', error);
  }
};

// Pianifica l'esecuzione della funzione ogni giorno alle 00:00
schedule.scheduleJob('0 0 * * *', deleteUnverifiedAccounts);

export const initScheduledJobs = () => {
  console.log('Lavori pianificati inizializzati');
};