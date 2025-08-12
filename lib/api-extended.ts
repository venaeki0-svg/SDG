import { supabase } from './supabase';
import { 
  TeamProjectPayment, TeamPaymentRecord, RewardLedgerEntry, Asset, 
  ClientFeedback, Contract, Notification, SocialMediaPost, PromoCode, 
  SOP, Profile
} from '../types';

// Team Project Payments
export const getTeamProjectPayments = async (): Promise<TeamProjectPayment[]> => {
  const { data, error } = await supabase.from('team_project_payments').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    projectId: row.project_id,
    teamMemberName: row.team_member_name,
    teamMemberId: row.team_member_id,
    date: row.date,
    status: row.status as any,
    fee: row.fee,
    reward: row.reward || 0,
  }));
};

export const createTeamProjectPayment = async (payment: Omit<TeamProjectPayment, 'id'>): Promise<TeamProjectPayment> => {
  const { data, error } = await supabase.from('team_project_payments').insert({
    project_id: payment.projectId,
    team_member_name: payment.teamMemberName,
    team_member_id: payment.teamMemberId,
    date: payment.date,
    status: payment.status,
    fee: payment.fee,
    reward: payment.reward,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    projectId: data.project_id,
    teamMemberName: data.team_member_name,
    teamMemberId: data.team_member_id,
    date: data.date,
    status: data.status as any,
    fee: data.fee,
    reward: data.reward || 0,
  };
};

export const updateTeamProjectPayment = async (id: string, updates: Partial<TeamProjectPayment>): Promise<TeamProjectPayment> => {
  const updateData: any = {};
  if (updates.projectId !== undefined) updateData.project_id = updates.projectId;
  if (updates.teamMemberName !== undefined) updateData.team_member_name = updates.teamMemberName;
  if (updates.teamMemberId !== undefined) updateData.team_member_id = updates.teamMemberId;
  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.fee !== undefined) updateData.fee = updates.fee;
  if (updates.reward !== undefined) updateData.reward = updates.reward;

  const { data, error } = await supabase.from('team_project_payments').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    projectId: data.project_id,
    teamMemberName: data.team_member_name,
    teamMemberId: data.team_member_id,
    date: data.date,
    status: data.status as any,
    fee: data.fee,
    reward: data.reward || 0,
  };
};

export const deleteTeamProjectPayment = async (id: string): Promise<void> => {
  const { error } = await supabase.from('team_project_payments').delete().eq('id', id);
  if (error) throw error;
};

// Team Payment Records
export const getTeamPaymentRecords = async (): Promise<TeamPaymentRecord[]> => {
  const { data, error } = await supabase.from('team_payment_records').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    recordNumber: row.record_number,
    teamMemberId: row.team_member_id,
    date: row.date,
    projectPaymentIds: row.project_payment_ids,
    totalAmount: row.total_amount,
    vendorSignature: row.vendor_signature || '',
  }));
};

export const createTeamPaymentRecord = async (record: Omit<TeamPaymentRecord, 'id'>): Promise<TeamPaymentRecord> => {
  const { data, error } = await supabase.from('team_payment_records').insert({
    record_number: record.recordNumber,
    team_member_id: record.teamMemberId,
    date: record.date,
    project_payment_ids: record.projectPaymentIds,
    total_amount: record.totalAmount,
    vendor_signature: record.vendorSignature,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    recordNumber: data.record_number,
    teamMemberId: data.team_member_id,
    date: data.date,
    projectPaymentIds: data.project_payment_ids,
    totalAmount: data.total_amount,
    vendorSignature: data.vendor_signature || '',
  };
};

export const updateTeamPaymentRecord = async (id: string, updates: Partial<TeamPaymentRecord>): Promise<TeamPaymentRecord> => {
  const updateData: any = {};
  if (updates.recordNumber !== undefined) updateData.record_number = updates.recordNumber;
  if (updates.teamMemberId !== undefined) updateData.team_member_id = updates.teamMemberId;
  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.projectPaymentIds !== undefined) updateData.project_payment_ids = updates.projectPaymentIds;
  if (updates.totalAmount !== undefined) updateData.total_amount = updates.totalAmount;
  if (updates.vendorSignature !== undefined) updateData.vendor_signature = updates.vendorSignature;

  const { data, error } = await supabase.from('team_payment_records').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    recordNumber: data.record_number,
    teamMemberId: data.team_member_id,
    date: data.date,
    projectPaymentIds: data.project_payment_ids,
    totalAmount: data.total_amount,
    vendorSignature: data.vendor_signature || '',
  };
};

export const deleteTeamPaymentRecord = async (id: string): Promise<void> => {
  const { error } = await supabase.from('team_payment_records').delete().eq('id', id);
  if (error) throw error;
};

// Reward Ledger Entries
export const getRewardLedgerEntries = async (): Promise<RewardLedgerEntry[]> => {
  const { data, error } = await supabase.from('reward_ledger_entries').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    teamMemberId: row.team_member_id,
    date: row.date,
    description: row.description,
    amount: row.amount,
    projectId: row.project_id || '',
  }));
};

export const createRewardLedgerEntry = async (entry: Omit<RewardLedgerEntry, 'id'>): Promise<RewardLedgerEntry> => {
  const { data, error } = await supabase.from('reward_ledger_entries').insert({
    team_member_id: entry.teamMemberId,
    date: entry.date,
    description: entry.description,
    amount: entry.amount,
    project_id: entry.projectId || null,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    teamMemberId: data.team_member_id,
    date: data.date,
    description: data.description,
    amount: data.amount,
    projectId: data.project_id || '',
  };
};

export const updateRewardLedgerEntry = async (id: string, updates: Partial<RewardLedgerEntry>): Promise<RewardLedgerEntry> => {
  const updateData: any = {};
  if (updates.teamMemberId !== undefined) updateData.team_member_id = updates.teamMemberId;
  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.amount !== undefined) updateData.amount = updates.amount;
  if (updates.projectId !== undefined) updateData.project_id = updates.projectId || null;

  const { data, error } = await supabase.from('reward_ledger_entries').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    teamMemberId: data.team_member_id,
    date: data.date,
    description: data.description,
    amount: data.amount,
    projectId: data.project_id || '',
  };
};

export const deleteRewardLedgerEntry = async (id: string): Promise<void> => {
  const { error } = await supabase.from('reward_ledger_entries').delete().eq('id', id);
  if (error) throw error;
};

// Assets
export const getAssets = async (): Promise<Asset[]> => {
  const { data, error } = await supabase.from('assets').select('*').order('name');
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    name: row.name,
    category: row.category,
    purchaseDate: row.purchase_date,
    purchasePrice: row.purchase_price,
    serialNumber: row.serial_number || '',
    status: row.status as any,
    notes: row.notes || '',
  }));
};

export const createAsset = async (asset: Omit<Asset, 'id'>): Promise<Asset> => {
  const { data, error } = await supabase.from('assets').insert({
    name: asset.name,
    category: asset.category,
    purchase_date: asset.purchaseDate,
    purchase_price: asset.purchasePrice,
    serial_number: asset.serialNumber,
    status: asset.status,
    notes: asset.notes,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    purchaseDate: data.purchase_date,
    purchasePrice: data.purchase_price,
    serialNumber: data.serial_number || '',
    status: data.status as any,
    notes: data.notes || '',
  };
};

export const updateAsset = async (id: string, updates: Partial<Asset>): Promise<Asset> => {
  const updateData: any = {};
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.purchaseDate !== undefined) updateData.purchase_date = updates.purchaseDate;
  if (updates.purchasePrice !== undefined) updateData.purchase_price = updates.purchasePrice;
  if (updates.serialNumber !== undefined) updateData.serial_number = updates.serialNumber;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.notes !== undefined) updateData.notes = updates.notes;

  const { data, error } = await supabase.from('assets').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    purchaseDate: data.purchase_date,
    purchasePrice: data.purchase_price,
    serialNumber: data.serial_number || '',
    status: data.status as any,
    notes: data.notes || '',
  };
};

export const deleteAsset = async (id: string): Promise<void> => {
  const { error } = await supabase.from('assets').delete().eq('id', id);
  if (error) throw error;
};

// Client Feedback
export const getClientFeedback = async (): Promise<ClientFeedback[]> => {
  const { data, error } = await supabase.from('client_feedback').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    clientName: row.client_name,
    satisfaction: row.satisfaction as any,
    rating: row.rating,
    feedback: row.feedback,
    date: row.date,
  }));
};

export const createClientFeedback = async (feedback: Omit<ClientFeedback, 'id'>): Promise<ClientFeedback> => {
  const { data, error } = await supabase.from('client_feedback').insert({
    client_name: feedback.clientName,
    satisfaction: feedback.satisfaction,
    rating: feedback.rating,
    feedback: feedback.feedback,
    date: feedback.date,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    clientName: data.client_name,
    satisfaction: data.satisfaction as any,
    rating: data.rating,
    feedback: data.feedback,
    date: data.date,
  };
};

// Contracts
export const getContracts = async (): Promise<Contract[]> => {
  const { data, error } = await supabase.from('contracts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    contractNumber: row.contract_number,
    clientId: row.client_id,
    projectId: row.project_id,
    signingDate: row.signing_date,
    signingLocation: row.signing_location,
    clientName1: row.client_name1,
    clientAddress1: row.client_address1,
    clientPhone1: row.client_phone1,
    clientName2: row.client_name2 || '',
    clientAddress2: row.client_address2 || '',
    clientPhone2: row.client_phone2 || '',
    shootingDuration: row.shooting_duration,
    guaranteedPhotos: row.guaranteed_photos,
    albumDetails: row.album_details,
    digitalFilesFormat: row.digital_files_format,
    otherItems: row.other_items,
    personnelCount: row.personnel_count,
    deliveryTimeframe: row.delivery_timeframe,
    dpDate: row.dp_date,
    finalPaymentDate: row.final_payment_date,
    cancellationPolicy: row.cancellation_policy,
    jurisdiction: row.jurisdiction,
    vendorSignature: row.vendor_signature || '',
    clientSignature: row.client_signature || '',
    createdAt: row.created_at,
  }));
};

export const createContract = async (contract: Omit<Contract, 'id' | 'createdAt'>): Promise<Contract> => {
  const { data, error } = await supabase.from('contracts').insert({
    contract_number: contract.contractNumber,
    client_id: contract.clientId,
    project_id: contract.projectId,
    signing_date: contract.signingDate,
    signing_location: contract.signingLocation,
    client_name1: contract.clientName1,
    client_address1: contract.clientAddress1,
    client_phone1: contract.clientPhone1,
    client_name2: contract.clientName2,
    client_address2: contract.clientAddress2,
    client_phone2: contract.clientPhone2,
    shooting_duration: contract.shootingDuration,
    guaranteed_photos: contract.guaranteedPhotos,
    album_details: contract.albumDetails,
    digital_files_format: contract.digitalFilesFormat,
    other_items: contract.otherItems,
    personnel_count: contract.personnelCount,
    delivery_timeframe: contract.deliveryTimeframe,
    dp_date: contract.dpDate,
    final_payment_date: contract.finalPaymentDate,
    cancellation_policy: contract.cancellationPolicy,
    jurisdiction: contract.jurisdiction,
    vendor_signature: contract.vendorSignature,
    client_signature: contract.clientSignature,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    contractNumber: data.contract_number,
    clientId: data.client_id,
    projectId: data.project_id,
    signingDate: data.signing_date,
    signingLocation: data.signing_location,
    clientName1: data.client_name1,
    clientAddress1: data.client_address1,
    clientPhone1: data.client_phone1,
    clientName2: data.client_name2 || '',
    clientAddress2: data.client_address2 || '',
    clientPhone2: data.client_phone2 || '',
    shootingDuration: data.shooting_duration,
    guaranteedPhotos: data.guaranteed_photos,
    albumDetails: data.album_details,
    digitalFilesFormat: data.digital_files_format,
    otherItems: data.other_items,
    personnelCount: data.personnel_count,
    deliveryTimeframe: data.delivery_timeframe,
    dpDate: data.dp_date,
    finalPaymentDate: data.final_payment_date,
    cancellationPolicy: data.cancellation_policy,
    jurisdiction: data.jurisdiction,
    vendorSignature: data.vendor_signature || '',
    clientSignature: data.client_signature || '',
    createdAt: data.created_at,
  };
};

export const updateContract = async (id: string, updates: Partial<Contract>): Promise<Contract> => {
  const updateData: any = {};
  if (updates.contractNumber !== undefined) updateData.contract_number = updates.contractNumber;
  if (updates.clientId !== undefined) updateData.client_id = updates.clientId;
  if (updates.projectId !== undefined) updateData.project_id = updates.projectId;
  if (updates.signingDate !== undefined) updateData.signing_date = updates.signingDate;
  if (updates.signingLocation !== undefined) updateData.signing_location = updates.signingLocation;
  if (updates.clientName1 !== undefined) updateData.client_name1 = updates.clientName1;
  if (updates.clientAddress1 !== undefined) updateData.client_address1 = updates.clientAddress1;
  if (updates.clientPhone1 !== undefined) updateData.client_phone1 = updates.clientPhone1;
  if (updates.clientName2 !== undefined) updateData.client_name2 = updates.clientName2;
  if (updates.clientAddress2 !== undefined) updateData.client_address2 = updates.clientAddress2;
  if (updates.clientPhone2 !== undefined) updateData.client_phone2 = updates.clientPhone2;
  if (updates.shootingDuration !== undefined) updateData.shooting_duration = updates.shootingDuration;
  if (updates.guaranteedPhotos !== undefined) updateData.guaranteed_photos = updates.guaranteedPhotos;
  if (updates.albumDetails !== undefined) updateData.album_details = updates.albumDetails;
  if (updates.digitalFilesFormat !== undefined) updateData.digital_files_format = updates.digitalFilesFormat;
  if (updates.otherItems !== undefined) updateData.other_items = updates.otherItems;
  if (updates.personnelCount !== undefined) updateData.personnel_count = updates.personnelCount;
  if (updates.deliveryTimeframe !== undefined) updateData.delivery_timeframe = updates.deliveryTimeframe;
  if (updates.dpDate !== undefined) updateData.dp_date = updates.dpDate;
  if (updates.finalPaymentDate !== undefined) updateData.final_payment_date = updates.finalPaymentDate;
  if (updates.cancellationPolicy !== undefined) updateData.cancellation_policy = updates.cancellationPolicy;
  if (updates.jurisdiction !== undefined) updateData.jurisdiction = updates.jurisdiction;
  if (updates.vendorSignature !== undefined) updateData.vendor_signature = updates.vendorSignature;
  if (updates.clientSignature !== undefined) updateData.client_signature = updates.clientSignature;

  const { data, error } = await supabase.from('contracts').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    contractNumber: data.contract_number,
    clientId: data.client_id,
    projectId: data.project_id,
    signingDate: data.signing_date,
    signingLocation: data.signing_location,
    clientName1: data.client_name1,
    clientAddress1: data.client_address1,
    clientPhone1: data.client_phone1,
    clientName2: data.client_name2 || '',
    clientAddress2: data.client_address2 || '',
    clientPhone2: data.client_phone2 || '',
    shootingDuration: data.shooting_duration,
    guaranteedPhotos: data.guaranteed_photos,
    albumDetails: data.album_details,
    digitalFilesFormat: data.digital_files_format,
    otherItems: data.other_items,
    personnelCount: data.personnel_count,
    deliveryTimeframe: data.delivery_timeframe,
    dpDate: data.dp_date,
    finalPaymentDate: data.final_payment_date,
    cancellationPolicy: data.cancellation_policy,
    jurisdiction: data.jurisdiction,
    vendorSignature: data.vendor_signature || '',
    clientSignature: data.client_signature || '',
    createdAt: data.created_at,
  };
};

export const deleteContract = async (id: string): Promise<void> => {
  const { error } = await supabase.from('contracts').delete().eq('id', id);
  if (error) throw error;
};

// Notifications
export const getNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase.from('notifications').select('*').order('timestamp', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    title: row.title,
    message: row.message,
    timestamp: row.timestamp,
    isRead: row.is_read,
    icon: row.icon as any,
    link: row.link_view ? {
      view: row.link_view as any,
      action: row.link_action || {},
    } : undefined,
  }));
};

export const createNotification = async (notification: Omit<Notification, 'id'>): Promise<Notification> => {
  const { data, error } = await supabase.from('notifications').insert({
    title: notification.title,
    message: notification.message,
    timestamp: notification.timestamp,
    is_read: notification.isRead,
    icon: notification.icon,
    link_view: notification.link?.view,
    link_action: notification.link?.action,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    message: data.message,
    timestamp: data.timestamp,
    isRead: data.is_read,
    icon: data.icon as any,
    link: data.link_view ? {
      view: data.link_view as any,
      action: data.link_action || {},
    } : undefined,
  };
};

export const updateNotification = async (id: string, updates: Partial<Notification>): Promise<Notification> => {
  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.message !== undefined) updateData.message = updates.message;
  if (updates.timestamp !== undefined) updateData.timestamp = updates.timestamp;
  if (updates.isRead !== undefined) updateData.is_read = updates.isRead;
  if (updates.icon !== undefined) updateData.icon = updates.icon;
  if (updates.link !== undefined) {
    updateData.link_view = updates.link?.view;
    updateData.link_action = updates.link?.action;
  }

  const { data, error } = await supabase.from('notifications').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    message: data.message,
    timestamp: data.timestamp,
    isRead: data.is_read,
    icon: data.icon as any,
    link: data.link_view ? {
      view: data.link_view as any,
      action: data.link_action || {},
    } : undefined,
  };
};

// Social Media Posts
export const getSocialMediaPosts = async (): Promise<SocialMediaPost[]> => {
  const { data, error } = await supabase.from('social_media_posts').select('*').order('scheduled_date', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    projectId: row.project_id,
    clientName: row.client_name,
    postType: row.post_type as any,
    platform: row.platform as any,
    scheduledDate: row.scheduled_date,
    caption: row.caption,
    mediaUrl: row.media_url || '',
    status: row.status as any,
    notes: row.notes || '',
  }));
};

export const createSocialMediaPost = async (post: Omit<SocialMediaPost, 'id'>): Promise<SocialMediaPost> => {
  const { data, error } = await supabase.from('social_media_posts').insert({
    project_id: post.projectId,
    client_name: post.clientName,
    post_type: post.postType,
    platform: post.platform,
    scheduled_date: post.scheduledDate,
    caption: post.caption,
    media_url: post.mediaUrl,
    status: post.status,
    notes: post.notes,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    projectId: data.project_id,
    clientName: data.client_name,
    postType: data.post_type as any,
    platform: data.platform as any,
    scheduledDate: data.scheduled_date,
    caption: data.caption,
    mediaUrl: data.media_url || '',
    status: data.status as any,
    notes: data.notes || '',
  };
};

export const updateSocialMediaPost = async (id: string, updates: Partial<SocialMediaPost>): Promise<SocialMediaPost> => {
  const updateData: any = {};
  if (updates.projectId !== undefined) updateData.project_id = updates.projectId;
  if (updates.clientName !== undefined) updateData.client_name = updates.clientName;
  if (updates.postType !== undefined) updateData.post_type = updates.postType;
  if (updates.platform !== undefined) updateData.platform = updates.platform;
  if (updates.scheduledDate !== undefined) updateData.scheduled_date = updates.scheduledDate;
  if (updates.caption !== undefined) updateData.caption = updates.caption;
  if (updates.mediaUrl !== undefined) updateData.media_url = updates.mediaUrl;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.notes !== undefined) updateData.notes = updates.notes;

  const { data, error } = await supabase.from('social_media_posts').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    projectId: data.project_id,
    clientName: data.client_name,
    postType: data.post_type as any,
    platform: data.platform as any,
    scheduledDate: data.scheduled_date,
    caption: data.caption,
    mediaUrl: data.media_url || '',
    status: data.status as any,
    notes: data.notes || '',
  };
};

export const deleteSocialMediaPost = async (id: string): Promise<void> => {
  const { error } = await supabase.from('social_media_posts').delete().eq('id', id);
  if (error) throw error;
};

// Promo Codes
export const getPromoCodes = async (): Promise<PromoCode[]> => {
  const { data, error } = await supabase.from('promo_codes').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    code: row.code,
    discountType: row.discount_type as any,
    discountValue: row.discount_value,
    isActive: row.is_active,
    usageCount: row.usage_count,
    maxUsage: row.max_usage || null,
    expiryDate: row.expiry_date || null,
    createdAt: row.created_at,
  }));
};

export const createPromoCode = async (promoCode: Omit<PromoCode, 'id' | 'createdAt'>): Promise<PromoCode> => {
  const { data, error } = await supabase.from('promo_codes').insert({
    code: promoCode.code,
    discount_type: promoCode.discountType,
    discount_value: promoCode.discountValue,
    is_active: promoCode.isActive,
    usage_count: promoCode.usageCount,
    max_usage: promoCode.maxUsage,
    expiry_date: promoCode.expiryDate,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    code: data.code,
    discountType: data.discount_type as any,
    discountValue: data.discount_value,
    isActive: data.is_active,
    usageCount: data.usage_count,
    maxUsage: data.max_usage || null,
    expiryDate: data.expiry_date || null,
    createdAt: data.created_at,
  };
};

export const updatePromoCode = async (id: string, updates: Partial<PromoCode>): Promise<PromoCode> => {
  const updateData: any = {};
  if (updates.code !== undefined) updateData.code = updates.code;
  if (updates.discountType !== undefined) updateData.discount_type = updates.discountType;
  if (updates.discountValue !== undefined) updateData.discount_value = updates.discountValue;
  if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
  if (updates.usageCount !== undefined) updateData.usage_count = updates.usageCount;
  if (updates.maxUsage !== undefined) updateData.max_usage = updates.maxUsage;
  if (updates.expiryDate !== undefined) updateData.expiry_date = updates.expiryDate;

  const { data, error } = await supabase.from('promo_codes').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    code: data.code,
    discountType: data.discount_type as any,
    discountValue: data.discount_value,
    isActive: data.is_active,
    usageCount: data.usage_count,
    maxUsage: data.max_usage || null,
    expiryDate: data.expiry_date || null,
    createdAt: data.created_at,
  };
};

export const deletePromoCode = async (id: string): Promise<void> => {
  const { error } = await supabase.from('promo_codes').delete().eq('id', id);
  if (error) throw error;
};

// SOPs
export const getSOPs = async (): Promise<SOP[]> => {
  const { data, error } = await supabase.from('sops').select('*').order('title');
  if (error) throw error;
  return data.map(row => ({
    id: row.id,
    title: row.title,
    category: row.category,
    content: row.content,
    lastUpdated: row.last_updated,
  }));
};

export const createSOP = async (sop: Omit<SOP, 'id'>): Promise<SOP> => {
  const { data, error } = await supabase.from('sops').insert({
    title: sop.title,
    category: sop.category,
    content: sop.content,
    last_updated: sop.lastUpdated,
  }).select().single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    category: data.category,
    content: data.content,
    lastUpdated: data.last_updated,
  };
};

export const updateSOP = async (id: string, updates: Partial<SOP>): Promise<SOP> => {
  const updateData: any = {};
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.content !== undefined) updateData.content = updates.content;
  if (updates.lastUpdated !== undefined) updateData.last_updated = updates.lastUpdated;

  const { data, error } = await supabase.from('sops').update(updateData).eq('id', id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    category: data.category,
    content: data.content,
    lastUpdated: data.last_updated,
  };
};

export const deleteSOP = async (id: string): Promise<void> => {
  const { error } = await supabase.from('sops').delete().eq('id', id);
  if (error) throw error;
};

// Profile
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
  if (error) return null;
  return {
    fullName: data.full_name,
    email: data.email,
    phone: data.phone,
    companyName: data.company_name,
    website: data.website,
    address: data.address,
    bankAccount: data.bank_account,
    authorizedSigner: data.authorized_signer,
    idNumber: data.id_number || '',
    bio: data.bio,
    incomeCategories: data.income_categories || [],
    expenseCategories: data.expense_categories || [],
    projectTypes: data.project_types || [],
    eventTypes: data.event_types || [],
    assetCategories: data.asset_categories || [],
    sopCategories: data.sop_categories || [],
    projectStatusConfig: data.project_status_config || [],
    notificationSettings: data.notification_settings || {},
    securitySettings: data.security_settings || {},
    briefingTemplate: data.briefing_template,
    termsAndConditions: data.terms_and_conditions || '',
    contractTemplate: data.contract_template || '',
  };
};

export const createProfile = async (userId: string, profile: Profile): Promise<Profile> => {
  const { data, error } = await supabase.from('profiles').insert({
    user_id: userId,
    full_name: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    company_name: profile.companyName,
    website: profile.website,
    address: profile.address,
    bank_account: profile.bankAccount,
    authorized_signer: profile.authorizedSigner,
    id_number: profile.idNumber,
    bio: profile.bio,
    income_categories: profile.incomeCategories,
    expense_categories: profile.expenseCategories,
    project_types: profile.projectTypes,
    event_types: profile.eventTypes,
    asset_categories: profile.assetCategories,
    sop_categories: profile.sopCategories,
    project_status_config: profile.projectStatusConfig,
    notification_settings: profile.notificationSettings,
    security_settings: profile.securitySettings,
    briefing_template: profile.briefingTemplate,
    terms_and_conditions: profile.termsAndConditions,
    contract_template: profile.contractTemplate,
  }).select().single();
  if (error) throw error;
  return profile;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
  const updateData: any = {};
  if (updates.fullName !== undefined) updateData.full_name = updates.fullName;
  if (updates.email !== undefined) updateData.email = updates.email;
  if (updates.phone !== undefined) updateData.phone = updates.phone;
  if (updates.companyName !== undefined) updateData.company_name = updates.companyName;
  if (updates.website !== undefined) updateData.website = updates.website;
  if (updates.address !== undefined) updateData.address = updates.address;
  if (updates.bankAccount !== undefined) updateData.bank_account = updates.bankAccount;
  if (updates.authorizedSigner !== undefined) updateData.authorized_signer = updates.authorizedSigner;
  if (updates.idNumber !== undefined) updateData.id_number = updates.idNumber;
  if (updates.bio !== undefined) updateData.bio = updates.bio;
  if (updates.incomeCategories !== undefined) updateData.income_categories = updates.incomeCategories;
  if (updates.expenseCategories !== undefined) updateData.expense_categories = updates.expenseCategories;
  if (updates.projectTypes !== undefined) updateData.project_types = updates.projectTypes;
  if (updates.eventTypes !== undefined) updateData.event_types = updates.eventTypes;
  if (updates.assetCategories !== undefined) updateData.asset_categories = updates.assetCategories;
  if (updates.sopCategories !== undefined) updateData.sop_categories = updates.sopCategories;
  if (updates.projectStatusConfig !== undefined) updateData.project_status_config = updates.projectStatusConfig;
  if (updates.notificationSettings !== undefined) updateData.notification_settings = updates.notificationSettings;
  if (updates.securitySettings !== undefined) updateData.security_settings = updates.securitySettings;
  if (updates.briefingTemplate !== undefined) updateData.briefing_template = updates.briefingTemplate;
  if (updates.termsAndConditions !== undefined) updateData.terms_and_conditions = updates.termsAndConditions;
  if (updates.contractTemplate !== undefined) updateData.contract_template = updates.contractTemplate;

  const { data, error } = await supabase.from('profiles').update(updateData).eq('user_id', userId).select().single();
  if (error) throw error;
  return {
    fullName: data.full_name,
    email: data.email,
    phone: data.phone,
    companyName: data.company_name,
    website: data.website,
    address: data.address,
    bankAccount: data.bank_account,
    authorizedSigner: data.authorized_signer,
    idNumber: data.id_number || '',
    bio: data.bio,
    incomeCategories: data.income_categories || [],
    expenseCategories: data.expense_categories || [],
    projectTypes: data.project_types || [],
    eventTypes: data.event_types || [],
    assetCategories: data.asset_categories || [],
    sopCategories: data.sop_categories || [],
    projectStatusConfig: data.project_status_config || [],
    notificationSettings: data.notification_settings || {},
    securitySettings: data.security_settings || {},
    briefingTemplate: data.briefing_template,
    termsAndConditions: data.terms_and_conditions || '',
    contractTemplate: data.contract_template || '',
  };
};