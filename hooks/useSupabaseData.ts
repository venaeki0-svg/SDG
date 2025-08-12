import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as api from '../lib/api';
import * as apiExtended from '../lib/api-extended';
import DataImporter from '../components/DataImporter';
import { 
  Client, Project, Package, AddOn, TeamMember, Transaction, Lead, 
  Card, FinancialPocket, TeamProjectPayment, TeamPaymentRecord, 
  RewardLedgerEntry, Asset, ClientFeedback, Contract, Notification,
  SocialMediaPost, PromoCode, SOP, Profile, User
} from '../types';

export const useSupabaseData = () => {
  // State for all entities
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [pockets, setPockets] = useState<FinancialPocket[]>([]);
  const [teamProjectPayments, setTeamProjectPayments] = useState<TeamProjectPayment[]>([]);
  const [teamPaymentRecords, setTeamPaymentRecords] = useState<TeamPaymentRecord[]>([]);
  const [rewardLedgerEntries, setRewardLedgerEntries] = useState<RewardLedgerEntry[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [clientFeedback, setClientFeedback] = useState<ClientFeedback[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [sops, setSops] = useState<SOP[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsDataImport, setNeedsDataImport] = useState(false);

  // Load all data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        usersData,
        clientsData,
        projectsData,
        packagesData,
        addOnsData,
        teamMembersData,
        transactionsData,
        leadsData,
        cardsData,
        pocketsData,
        teamProjectPaymentsData,
        teamPaymentRecordsData,
        rewardLedgerEntriesData,
        assetsData,
        clientFeedbackData,
        contractsData,
        notificationsData,
        socialMediaPostsData,
        promoCodesData,
        sopsData,
      ] = await Promise.all([
        api.getUsers(),
        api.getClients(),
        api.getProjects(),
        api.getPackages(),
        api.getAddOns(),
        api.getTeamMembers(),
        api.getTransactions(),
        api.getLeads(),
        api.getCards(),
        api.getFinancialPockets(),
        apiExtended.getTeamProjectPayments(),
        apiExtended.getTeamPaymentRecords(),
        apiExtended.getRewardLedgerEntries(),
        apiExtended.getAssets(),
        apiExtended.getClientFeedback(),
        apiExtended.getContracts(),
        apiExtended.getNotifications(),
        apiExtended.getSocialMediaPosts(),
        apiExtended.getPromoCodes(),
        apiExtended.getSOPs(),
      ]);

      // Check if we have any data, if not, suggest importing mock data
      const hasData = clientsData.length > 0 || projectsData.length > 0 || packagesData.length > 0;
      if (!hasData) {
        setNeedsDataImport(true);
        setLoading(false);
        return;
      }

      setUsers(usersData);
      setClients(clientsData);
      setProjects(projectsData);
      setPackages(packagesData);
      setAddOns(addOnsData);
      setTeamMembers(teamMembersData);
      setTransactions(transactionsData);
      setLeads(leadsData);
      setCards(cardsData);
      setPockets(pocketsData);
      setTeamProjectPayments(teamProjectPaymentsData);
      setTeamPaymentRecords(teamPaymentRecordsData);
      setRewardLedgerEntries(rewardLedgerEntriesData);
      setAssets(assetsData);
      setClientFeedback(clientFeedbackData);
      setContracts(contractsData);
      setNotifications(notificationsData);
      setSocialMediaPosts(socialMediaPostsData);
      setPromoCodes(promoCodesData);
      setSops(sopsData);

      // Load profile for current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const profileData = await apiExtended.getProfile(user.id);
        setProfile(profileData);
      }

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations with optimistic updates
  const createClientOptimistic = async (client: Omit<Client, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    const tempClient = { ...client, id: tempId };
    setClients(prev => [tempClient, ...prev]);
    
    try {
      const newClient = await api.createClient(client);
      setClients(prev => prev.map(c => c.id === tempId ? newClient : c));
      return newClient;
    } catch (error) {
      setClients(prev => prev.filter(c => c.id !== tempId));
      throw error;
    }
  };

  const updateClientOptimistic = async (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    
    try {
      const updatedClient = await api.updateClient(id, updates);
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      return updatedClient;
    } catch (error) {
      // Revert on error
      loadData();
      throw error;
    }
  };

  const deleteClientOptimistic = async (id: string) => {
    const originalClients = clients;
    setClients(prev => prev.filter(c => c.id !== id));
    
    try {
      await api.deleteClient(id);
    } catch (error) {
      setClients(originalClients);
      throw error;
    }
  };

  // Similar optimistic update functions for other entities
  const createProjectOptimistic = async (project: Omit<Project, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    const tempProject = { ...project, id: tempId };
    setProjects(prev => [tempProject, ...prev]);
    
    try {
      const newProject = await api.createProject(project);
      setProjects(prev => prev.map(p => p.id === tempId ? newProject : p));
      return newProject;
    } catch (error) {
      setProjects(prev => prev.filter(p => p.id !== tempId));
      throw error;
    }
  };

  const updateProjectOptimistic = async (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    
    try {
      const updatedProject = await api.updateProject(id, updates);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (error) {
      loadData();
      throw error;
    }
  };

  const deleteProjectOptimistic = async (id: string) => {
    const originalProjects = projects;
    setProjects(prev => prev.filter(p => p.id !== id));
    
    try {
      await api.deleteProject(id);
    } catch (error) {
      setProjects(originalProjects);
      throw error;
    }
  };

  // Transaction operations
  const createTransactionOptimistic = async (transaction: Omit<Transaction, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    const tempTransaction = { ...transaction, id: tempId };
    setTransactions(prev => [tempTransaction, ...prev]);
    
    try {
      const newTransaction = await api.createTransaction(transaction);
      setTransactions(prev => prev.map(t => t.id === tempId ? newTransaction : t));
      return newTransaction;
    } catch (error) {
      setTransactions(prev => prev.filter(t => t.id !== tempId));
      throw error;
    }
  };

  const updateTransactionOptimistic = async (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    
    try {
      const updatedTransaction = await api.updateTransaction(id, updates);
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
      return updatedTransaction;
    } catch (error) {
      loadData();
      throw error;
    }
  };

  const deleteTransactionOptimistic = async (id: string) => {
    const originalTransactions = transactions;
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    try {
      await api.deleteTransaction(id);
    } catch (error) {
      setTransactions(originalTransactions);
      throw error;
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    const setupSubscriptions = () => {
      // Subscribe to changes in all tables
      const subscriptions = [
        supabase.channel('clients').on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => loadData()),
        supabase.channel('projects').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => loadData()),
        supabase.channel('transactions').on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => loadData()),
        supabase.channel('leads').on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => loadData()),
        supabase.channel('notifications').on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => loadData()),
      ];

      subscriptions.forEach(sub => sub.subscribe());

      return () => {
        subscriptions.forEach(sub => sub.unsubscribe());
      };
    };

    const cleanup = setupSubscriptions();
    return cleanup;
  }, []);

  // Initial data load
  useEffect(() => {
    loadData();
  }, []);

  // Show data importer if no data exists
  if (needsDataImport) {
    return {
      needsDataImport: true,
      DataImporterComponent: () => <DataImporter onComplete={() => { setNeedsDataImport(false); loadData(); }} />,
      loading: false,
      error: null,
    } as any;
  }

  return {
    // Data
    users, clients, projects, packages, addOns, teamMembers, transactions, leads,
    cards, pockets, teamProjectPayments, teamPaymentRecords, rewardLedgerEntries,
    assets, clientFeedback, contracts, notifications, socialMediaPosts, promoCodes,
    sops, profile,
    
    // State setters (for direct manipulation when needed)
    setUsers, setClients, setProjects, setPackages, setAddOns, setTeamMembers,
    setTransactions, setLeads, setCards, setPockets, setTeamProjectPayments,
    setTeamPaymentRecords, setRewardLedgerEntries, setAssets, setClientFeedback,
    setContracts, setNotifications, setSocialMediaPosts, setPromoCodes, setSops,
    setProfile,
    
    // CRUD operations
    createClient: createClientOptimistic,
    updateClient: updateClientOptimistic,
    deleteClient: deleteClientOptimistic,
    
    createProject: createProjectOptimistic,
    updateProject: updateProjectOptimistic,
    deleteProject: deleteProjectOptimistic,
    
    createTransaction: createTransactionOptimistic,
    updateTransaction: updateTransactionOptimistic,
    deleteTransaction: deleteTransactionOptimistic,
    
    // Utility
    loading,
    error,
    refetch: loadData,
    needsDataImport: false,
  };
};