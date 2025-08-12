import { supabase } from './supabase';
import { Database } from './database.types';
import { 
  Client, Project, Package, AddOn, TeamMember, Transaction, Lead, 
  Card, FinancialPocket, TeamProjectPayment, TeamPaymentRecord, 
  RewardLedgerEntry, Asset, ClientFeedback, Contract, Notification,
  SocialMediaPost, PromoCode, SOP, Profile, User
} from '../types';

type Tables = Database['public']['Tables'];

// Helper function to transform database row to app type
const transformClient = (row: Tables['clients']['Row']): Client => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  instagram: row.instagram || '',
  since: row.since,
  status: row.status as any,
  clientType: row.client_type as any,
  lastContact: row.last_contact,
  portalAccessId: row.portal_access_id,
});

const transformProject = (row: Tables['projects']['Row']): Project => ({
  id: row.id,
  projectName: row.project_name,
  clientName: row.client_name,
  clientId: row.client_id,
  projectType: row.project_type,
  packageName: row.package_name,
  packageId: row.package_id,
  addOns: row.add_ons || [],
  date: row.date,
  deadlineDate: row.deadline_date || '',
  location: row.location,
  progress: row.progress,
  status: row.status,
  activeSubStatuses: row.active_sub_statuses || [],
  totalCost: row.total_cost,
  amountPaid: row.amount_paid,
  paymentStatus: row.payment_status as any,
  team: row.team || [],
  notes: row.notes || '',
  accommodation: row.accommodation || '',
  driveLink: row.drive_link || '',
  clientDriveLink: row.client_drive_link || '',
  finalDriveLink: row.final_drive_link || '',
  startTime: row.start_time || '',
  endTime: row.end_time || '',
  image: row.image || '',
  revisions: row.revisions || [],
  promoCodeId: row.promo_code_id || '',
  discountAmount: row.discount_amount || 0,
  shippingDetails: row.shipping_details || '',
  dpProofUrl: row.dp_proof_url || '',
  printingDetails: row.printing_details || [],
  printingCost: row.printing_cost || 0,
  transportCost: row.transport_cost || 0,
  isEditingConfirmedByClient: row.is_editing_confirmed_by_client,
  isPrintingConfirmedByClient: row.is_printing_confirmed_by_client,
  isDeliveryConfirmedByClient: row.is_delivery_confirmed_by_client,
  confirmedSubStatuses: row.confirmed_sub_statuses || [],
  clientSubStatusNotes: row.client_sub_status_notes || {},
  subStatusConfirmationSentAt: row.sub_status_confirmation_sent_at || {},
  completedDigitalItems: row.completed_digital_items || [],
  invoiceSignature: row.invoice_signature || '',
});

// API Functions

// Users
export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    email: row.email,
    password: '', // Don't expose passwords
    fullName: row.full_name,
    role: row.role as any,
    permissions: row.permissions as any,
  }));
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const { data, error } = await supabase.from('users').insert({
    email: user.email,
    full_name: user.fullName,
    role: user.role,
    permissions: user.permissions || [],
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    email: data.email,
    password: '',
    fullName: data.full_name,
    role: data.role as any,
    permissions: data.permissions as any,
  };
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  const { data, error } = await supabase.from('users').update({
    email: updates.email,
    full_name: updates.fullName,
    role: updates.role,
    permissions: updates.permissions || [],
  }).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    email: data.email,
    password: '',
    fullName: data.full_name,
    role: data.role as any,
    permissions: data.permissions as any,
  };
};

export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) throw error;
};

// Clients
export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(transformClient);
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  const { data, error } = await supabase.from('clients').insert({
    name: client.name,
    email: client.email,
    phone: client.phone,
    instagram: client.instagram,
    since: client.since,
    status: client.status,
    client_type: client.clientType,
    last_contact: client.lastContact,
    portal_access_id: client.portalAccessId,
  }).select().single();
  if (error) throw error;
  return transformClient(data);
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<Client> => {
  const { data, error } = await supabase.from('clients').update({
    name: updates.name,
    email: updates.email,
    phone: updates.phone,
    instagram: updates.instagram,
    since: updates.since,
    status: updates.status,
    client_type: updates.clientType,
    last_contact: updates.lastContact,
    portal_access_id: updates.portalAccessId,
  }).eq('id', id).select().single();
  if (error) throw error;
  return transformClient(data);
};

export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw error;
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(transformProject);
};

export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  const { data, error } = await supabase.from('projects').insert({
    project_name: project.projectName,
    client_name: project.clientName,
    client_id: project.clientId,
    project_type: project.projectType,
    package_name: project.packageName,
    package_id: project.packageId,
    add_ons: project.addOns,
    date: project.date,
    deadline_date: project.deadlineDate,
    location: project.location,
    progress: project.progress,
    status: project.status,
    active_sub_statuses: project.activeSubStatuses,
    total_cost: project.totalCost,
    amount_paid: project.amountPaid,
    payment_status: project.paymentStatus,
    team: project.team,
    notes: project.notes,
    accommodation: project.accommodation,
    drive_link: project.driveLink,
    client_drive_link: project.clientDriveLink,
    final_drive_link: project.finalDriveLink,
    start_time: project.startTime,
    end_time: project.endTime,
    image: project.image,
    revisions: project.revisions,
    promo_code_id: project.promoCodeId,
    discount_amount: project.discountAmount,
    shipping_details: project.shippingDetails,
    dp_proof_url: project.dpProofUrl,
    printing_details: project.printingDetails,
    printing_cost: project.printingCost,
    transport_cost: project.transportCost,
    is_editing_confirmed_by_client: project.isEditingConfirmedByClient,
    is_printing_confirmed_by_client: project.isPrintingConfirmedByClient,
    is_delivery_confirmed_by_client: project.isDeliveryConfirmedByClient,
    confirmed_sub_statuses: project.confirmedSubStatuses,
    client_sub_status_notes: project.clientSubStatusNotes,
    sub_status_confirmation_sent_at: project.subStatusConfirmationSentAt,
    completed_digital_items: project.completedDigitalItems,
    invoice_signature: project.invoiceSignature,
  }).select().single();
  if (error) throw error;
  return transformProject(data);
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
  const updateData: any = {};
  if (updates.projectName !== undefined) updateData.project_name = updates.projectName;
  if (updates.clientName !== undefined) updateData.client_name = updates.clientName;
  if (updates.clientId !== undefined) updateData.client_id = updates.clientId;
  if (updates.projectType !== undefined) updateData.project_type = updates.projectType;
  if (updates.packageName !== undefined) updateData.package_name = updates.packageName;
  if (updates.packageId !== undefined) updateData.package_id = updates.packageId;
  if (updates.addOns !== undefined) updateData.add_ons = updates.addOns;
  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.deadlineDate !== undefined) updateData.deadline_date = updates.deadlineDate;
  if (updates.location !== undefined) updateData.location = updates.location;
  if (updates.progress !== undefined) updateData.progress = updates.progress;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.activeSubStatuses !== undefined) updateData.active_sub_statuses = updates.activeSubStatuses;
  if (updates.totalCost !== undefined) updateData.total_cost = updates.totalCost;
  if (updates.amountPaid !== undefined) updateData.amount_paid = updates.amountPaid;
  if (updates.paymentStatus !== undefined) updateData.payment_status = updates.paymentStatus;
  if (updates.team !== undefined) updateData.team = updates.team;
  if (updates.notes !== undefined) updateData.notes = updates.notes;
  if (updates.accommodation !== undefined) updateData.accommodation = updates.accommodation;
  if (updates.driveLink !== undefined) updateData.drive_link = updates.driveLink;
  if (updates.clientDriveLink !== undefined) updateData.client_drive_link = updates.clientDriveLink;
  if (updates.finalDriveLink !== undefined) updateData.final_drive_link = updates.finalDriveLink;
  if (updates.startTime !== undefined) updateData.start_time = updates.startTime;
  if (updates.endTime !== undefined) updateData.end_time = updates.endTime;
  if (updates.image !== undefined) updateData.image = updates.image;
  if (updates.revisions !== undefined) updateData.revisions = updates.revisions;
  if (updates.promoCodeId !== undefined) updateData.promo_code_id = updates.promoCodeId;
  if (updates.discountAmount !== undefined) updateData.discount_amount = updates.discountAmount;
  if (updates.shippingDetails !== undefined) updateData.shipping_details = updates.shippingDetails;
  if (updates.dpProofUrl !== undefined) updateData.dp_proof_url = updates.dpProofUrl;
  if (updates.printingDetails !== undefined) updateData.printing_details = updates.printingDetails;
  if (updates.printingCost !== undefined) updateData.printing_cost = updates.printingCost;
  if (updates.transportCost !== undefined) updateData.transport_cost = updates.transportCost;
  if (updates.isEditingConfirmedByClient !== undefined) updateData.is_editing_confirmed_by_client = updates.isEditingConfirmedByClient;
  if (updates.isPrintingConfirmedByClient !== undefined) updateData.is_printing_confirmed_by_client = updates.isPrintingConfirmedByClient;
  if (updates.isDeliveryConfirmedByClient !== undefined) updateData.is_delivery_confirmed_by_client = updates.isDeliveryConfirmedByClient;
  if (updates.confirmedSubStatuses !== undefined) updateData.confirmed_sub_statuses = updates.confirmedSubStatuses;
  if (updates.clientSubStatusNotes !== undefined) updateData.client_sub_status_notes = updates.clientSubStatusNotes;
  if (updates.subStatusConfirmationSentAt !== undefined) updateData.sub_status_confirmation_sent_at = updates.subStatusConfirmationSentAt;
  if (updates.completedDigitalItems !== undefined) updateData.completed_digital_items = updates.completedDigitalItems;
  if (updates.invoiceSignature !== undefined) updateData.invoice_signature = updates.invoiceSignature;

  const { data, error } = await supabase.from('projects').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return transformProject(data);
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
};

// Packages
export const getPackages = async (): Promise<Package[]> => {
  const { data, error } = await supabase.from('packages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    name: row.name,
    price: row.price,
    physicalItems: row.physical_items || [],
    digitalItems: row.digital_items || [],
    processingTime: row.processing_time,
    photographers: row.photographers || '',
    videographers: row.videographers || '',
  }));
};

export const createPackage = async (pkg: Omit<Package, 'id'>): Promise<Package> => {
  const { data, error } = await supabase.from('packages').insert({
    name: pkg.name,
    price: pkg.price,
    physical_items: pkg.physicalItems,
    digital_items: pkg.digitalItems,
    processing_time: pkg.processingTime,
    photographers: pkg.photographers,
    videographers: pkg.videographers,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    price: data.price,
    physicalItems: data.physical_items || [],
    digitalItems: data.digital_items || [],
    processingTime: data.processing_time,
    photographers: data.photographers || '',
    videographers: data.videographers || '',
  };
};

export const updatePackage = async (id: string, updates: Partial<Package>): Promise<Package> => {
  const { data, error } = await supabase.from('packages').update({
    name: updates.name,
    price: updates.price,
    physical_items: updates.physicalItems,
    digital_items: updates.digitalItems,
    processing_time: updates.processingTime,
    photographers: updates.photographers,
    videographers: updates.videographers,
  }).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    price: data.price,
    physicalItems: data.physical_items || [],
    digitalItems: data.digital_items || [],
    processingTime: data.processing_time,
    photographers: data.photographers || '',
    videographers: data.videographers || '',
  };
};

export const deletePackage = async (id: string): Promise<void> => {
  const { error } = await supabase.from('packages').delete().eq('id', id);
  if (error) throw error;
};

// Add-ons
export const getAddOns = async (): Promise<AddOn[]> => {
  const { data, error } = await supabase.from('add_ons').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    name: row.name,
    price: row.price,
  }));
};

export const createAddOn = async (addOn: Omit<AddOn, 'id'>): Promise<AddOn> => {
  const { data, error } = await supabase.from('add_ons').insert({
    name: addOn.name,
    price: addOn.price,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    price: data.price,
  };
};

export const updateAddOn = async (id: string, updates: Partial<AddOn>): Promise<AddOn> => {
  const { data, error } = await supabase.from('add_ons').update({
    name: updates.name,
    price: updates.price,
  }).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    price: data.price,
  };
};

export const deleteAddOn = async (id: string): Promise<void> => {
  const { error } = await supabase.from('add_ons').delete().eq('id', id);
  if (error) throw error;
};

// Team Members
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    name: row.name,
    role: row.role,
    email: row.email,
    phone: row.phone,
    standardFee: row.standard_fee,
    noRek: row.no_rek || '',
    rewardBalance: row.reward_balance,
    rating: row.rating,
    performanceNotes: row.performance_notes || [],
    portalAccessId: row.portal_access_id,
  }));
};

export const createTeamMember = async (member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
  const { data, error } = await supabase.from('team_members').insert({
    name: member.name,
    role: member.role,
    email: member.email,
    phone: member.phone,
    standard_fee: member.standardFee,
    no_rek: member.noRek,
    reward_balance: member.rewardBalance,
    rating: member.rating,
    performance_notes: member.performanceNotes,
    portal_access_id: member.portalAccessId,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    role: data.role,
    email: data.email,
    phone: data.phone,
    standardFee: data.standard_fee,
    noRek: data.no_rek || '',
    rewardBalance: data.reward_balance,
    rating: data.rating,
    performanceNotes: data.performance_notes || [],
    portalAccessId: data.portal_access_id,
  };
};

export const updateTeamMember = async (id: string, updates: Partial<TeamMember>): Promise<TeamMember> => {
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.role !== undefined) updateData.role = updates.role;
  if (updates.email !== undefined) updateData.email = updates.email;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.standardFee !== undefined) updateData.standard_fee = updates.standardFee;
  if (updates.noRek !== undefined) updateData.no_rek = updates.noRek;
  if (updates.rewardBalance !== undefined) updateData.reward_balance = updates.rewardBalance;
  if (updates.rating !== undefined) updateData.rating = updates.rating;
  if (updates.performanceNotes !== undefined) updateData.performance_notes = updates.performanceNotes;
  if (updates.portalAccessId !== undefined) updateData.portal_access_id = updates.portalAccessId;

  const { data, error } = await supabase.from('team_members').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    role: data.role,
    email: data.email,
    phone: data.phone,
    standardFee: data.standard_fee,
    noRek: data.no_rek || '',
    rewardBalance: data.reward_balance,
    rating: data.rating,
    performanceNotes: data.performance_notes || [],
    portalAccessId: data.portal_access_id,
  };
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  const { error } = await supabase.from('team_members').delete().eq('id', id);
  if (error) throw error;
};

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase.from('transactions').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    date: row.date,
    description: row.description,
    amount: row.amount,
    type: row.type as any,
    projectId: row.project_id || '',
    category: row.category,
    method: row.method as any,
    pocketId: row.pocket_id || '',
    cardId: row.card_id || '',
    printingItemId: row.printing_item_id || '',
    vendorSignature: row.vendor_signature || '',
  }));
};

export const createTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  const { data, error } = await supabase.from('transactions').insert({
    date: transaction.date,
    description: transaction.description,
    amount: transaction.amount,
    type: transaction.type,
    project_id: transaction.projectId || null,
    category: transaction.category,
    method: transaction.method,
    pocket_id: transaction.pocketId || null,
    card_id: transaction.cardId || null,
    printing_item_id: transaction.printingItemId || null,
    vendor_signature: transaction.vendorSignature || null,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    date: data.date,
    description: data.description,
    amount: data.amount,
    type: data.type as any,
    projectId: data.project_id || '',
    category: data.category,
    method: data.method as any,
    pocketId: data.pocket_id || '',
    cardId: data.card_id || '',
    printingItemId: data.printing_item_id || '',
    vendorSignature: data.vendor_signature || '',
  };
};

export const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
  const updateData: any = {};
  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.amount !== undefined) updateData.amount = updates.amount;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.projectId !== undefined) updateData.project_id = updates.projectId || null;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.method !== undefined) updateData.method = updates.method;
  if (updates.pocketId !== undefined) updateData.pocket_id = updates.pocketId || null;
  if (updates.cardId !== undefined) updateData.card_id = updates.cardId || null;
  if (updates.printingItemId !== undefined) updateData.printing_item_id = updates.printingItemId || null;
  if (updates.vendorSignature !== undefined) updateData.vendor_signature = updates.vendorSignature || null;

  const { data, error } = await supabase.from('transactions').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    date: data.date,
    description: data.description,
    amount: data.amount,
    type: data.type as any,
    projectId: data.project_id || '',
    category: data.category,
    method: data.method as any,
    pocketId: data.pocket_id || '',
    cardId: data.card_id || '',
    printingItemId: data.printing_item_id || '',
    vendorSignature: data.vendor_signature || '',
  };
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const { error } = await supabase.from('transactions').delete().eq('id', id);
  if (error) throw error;
};

// Leads
export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    name: row.name,
    contactChannel: row.contact_channel as any,
    location: row.location,
    status: row.status as any,
    date: row.date,
    notes: row.notes || '',
  }));
};

export const createLead = async (lead: Omit<Lead, 'id'>): Promise<Lead> => {
  const { data, error } = await supabase.from('leads').insert({
    name: lead.name,
    contact_channel: lead.contactChannel,
    location: lead.location,
    status: lead.status,
    date: lead.date,
    notes: lead.notes,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    contactChannel: data.contact_channel as any,
    location: data.location,
    status: data.status as any,
    date: data.date,
    notes: data.notes || '',
  };
};

export const updateLead = async (id: string, updates: Partial<Lead>): Promise<Lead> => {
  const { data, error } = await supabase.from('leads').update({
    name: updates.name,
    contact_channel: updates.contactChannel,
    location: updates.location,
    status: updates.status,
    date: updates.date,
    notes: updates.notes,
  }).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    contactChannel: data.contact_channel as any,
    location: data.location,
    status: data.status as any,
    date: data.date,
    notes: data.notes || '',
  };
};

export const deleteLead = async (id: string): Promise<void> => {
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw error;
};

// Cards
export const getCards = async (): Promise<Card[]> => {
  const { data, error } = await supabase.from('cards').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    cardHolderName: row.card_holder_name,
    bankName: row.bank_name,
    cardType: row.card_type as any,
    lastFourDigits: row.last_four_digits,
    expiryDate: row.expiry_date || '',
    balance: row.balance,
    colorGradient: row.color_gradient,
  }));
};

export const createCard = async (card: Omit<Card, 'id'>): Promise<Card> => {
  const { data, error } = await supabase.from('cards').insert({
    card_holder_name: card.cardHolderName,
    bank_name: card.bankName,
    card_type: card.cardType,
    last_four_digits: card.lastFourDigits,
    expiry_date: card.expiryDate,
    balance: card.balance,
    color_gradient: card.colorGradient,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    cardHolderName: data.card_holder_name,
    bankName: data.bank_name,
    cardType: data.card_type as any,
    lastFourDigits: data.last_four_digits,
    expiryDate: data.expiry_date || '',
    balance: data.balance,
    colorGradient: data.color_gradient,
  };
};

export const updateCard = async (id: string, updates: Partial<Card>): Promise<Card> => {
  const updateData: any = {};
  if (updates.cardHolderName !== undefined) updateData.card_holder_name = updates.cardHolderName;
  if (updates.bankName !== undefined) updateData.bank_name = updates.bankName;
  if (updates.cardType !== undefined) updateData.card_type = updates.cardType;
  if (updates.lastFourDigits !== undefined) updateData.last_four_digits = updates.lastFourDigits;
  if (updates.expiryDate !== undefined) updateData.expiry_date = updates.expiryDate;
  if (updates.balance !== undefined) updateData.balance = updates.balance;
  if (updates.colorGradient !== undefined) updateData.color_gradient = updates.colorGradient;

  const { data, error } = await supabase.from('cards').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    cardHolderName: data.card_holder_name,
    bankName: data.bank_name,
    cardType: data.card_type as any,
    lastFourDigits: data.last_four_digits,
    expiryDate: data.expiry_date || '',
    balance: data.balance,
    colorGradient: data.color_gradient,
  };
};

export const deleteCard = async (id: string): Promise<void> => {
  const { error } = await supabase.from('cards').delete().eq('id', id);
  if (error) throw error;
};

// Financial Pockets
export const getFinancialPockets = async (): Promise<FinancialPocket[]> => {
  const { data, error } = await supabase.from('financial_pockets').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon as any,
    type: row.type as any,
    amount: row.amount,
    goalAmount: row.goal_amount || 0,
    lockEndDate: row.lock_end_date || '',
    members: row.members || [],
    sourceCardId: row.source_card_id || '',
  }));
};

export const createFinancialPocket = async (pocket: Omit<FinancialPocket, 'id'>): Promise<FinancialPocket> => {
  const { data, error } = await supabase.from('financial_pockets').insert({
    name: pocket.name,
    description: pocket.description,
    icon: pocket.icon,
    type: pocket.type,
    amount: pocket.amount,
    goal_amount: pocket.goalAmount,
    lock_end_date: pocket.lockEndDate,
    members: pocket.members,
    source_card_id: pocket.sourceCardId || null,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    icon: data.icon as any,
    type: data.type as any,
    amount: data.amount,
    goalAmount: data.goal_amount || 0,
    lockEndDate: data.lock_end_date || '',
    members: data.members || [],
    sourceCardId: data.source_card_id || '',
  };
};

export const updateFinancialPocket = async (id: string, updates: Partial<FinancialPocket>): Promise<FinancialPocket> => {
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.icon !== undefined) updateData.icon = updates.icon;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.amount !== undefined) updateData.amount = updates.amount;
  if (updates.goalAmount !== undefined) updateData.goal_amount = updates.goalAmount;
  if (updates.lockEndDate !== undefined) updateData.lock_end_date = updates.lockEndDate;
  if (updates.members !== undefined) updateData.members = updates.members;
  if (updates.sourceCardId !== undefined) updateData.source_card_id = updates.sourceCardId || null;

  const { data, error } = await supabase.from('financial_pockets').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    icon: data.icon as any,
    type: data.type as any,
    amount: data.amount,
    goalAmount: data.goal_amount || 0,
    lockEndDate: data.lock_end_date || '',
    members: data.members || [],
    sourceCardId: data.source_card_id || '',
  };
};

export const deleteFinancialPocket = async (id: string): Promise<void> => {
  const { error } = await supabase.from('financial_pockets').delete().eq('id', id);
  if (error) throw error;
};

// Similar functions for other entities...
// (I'll create the remaining functions in the next part to keep this manageable)

// Utility function to get client by portal access ID (for public forms)
export const getClientByPortalId = async (portalAccessId: string): Promise<Client | null> => {
  const { data, error } = await supabase.from('clients').select('*').eq('portal_access_id', portalAccessId).single();
  if (error) return null;
  return transformClient(data);
};

// Utility function to get team member by portal access ID
export const getTeamMemberByPortalId = async (portalAccessId: string): Promise<TeamMember | null> => {
  const { data, error } = await supabase.from('team_members').select('*').eq('portal_access_id', portalAccessId).single();
  if (error) return null;
  return {
    id: data.id,
    name: data.name,
    role: data.role,
    email: data.email,
    phone: data.phone,
    standardFee: data.standard_fee,
    noRek: data.no_rek || '',
    rewardBalance: data.reward_balance,
    rating: data.rating,
    performanceNotes: data.performance_notes || [],
    portalAccessId: data.portal_access_id,
  };
};