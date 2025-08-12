import { supabase } from './supabase';
import { 
  Client, Project, Package, AddOn, TeamMember, Transaction, Lead, 
  Card, FinancialPocket, PromoCode, Profile, ClientFeedback, Contract,
  SOP, Revision, RevisionStatus
} from '../types';
import * as api from './api';
import * as apiExtended from './api-extended';

// Public API functions for forms and portals (no authentication required)

// Get data for public booking form
export const getPublicBookingData = async () => {
  const { data: packagesData, error: packagesError } = await supabase.from('packages').select('*');
  const { data: addOnsData, error: addOnsError } = await supabase.from('add_ons').select('*');
  const { data: promoCodesData, error: promoCodesError } = await supabase.from('promo_codes').select('*').eq('is_active', true);
  const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').limit(1).single();
  const { data: cardsData, error: cardsError } = await supabase.from('cards').select('*');

  if (packagesError || addOnsError || promoCodesError || profileError || cardsError) {
    throw new Error('Failed to load booking form data');
  }

  return {
    packages: packagesData.map(row => ({
      id: row.id,
      name: row.name,
      price: row.price,
      physicalItems: row.physical_items || [],
      digitalItems: row.digital_items || [],
      processingTime: row.processing_time,
      photographers: row.photographers || '',
      videographers: row.videographers || '',
    })),
    addOns: addOnsData.map(row => ({
      id: row.id,
      name: row.name,
      price: row.price,
    })),
    promoCodes: promoCodesData.map(row => ({
      id: row.id,
      code: row.code,
      discountType: row.discount_type as any,
      discountValue: row.discount_value,
      isActive: row.is_active,
      usageCount: row.usage_count,
      maxUsage: row.max_usage || null,
      expiryDate: row.expiry_date || null,
      createdAt: row.created_at,
    })),
    profile: {
      fullName: profileData.full_name,
      email: profileData.email,
      phone: profileData.phone,
      companyName: profileData.company_name,
      website: profileData.website,
      address: profileData.address,
      bankAccount: profileData.bank_account,
      authorizedSigner: profileData.authorized_signer,
      idNumber: profileData.id_number || '',
      bio: profileData.bio,
      incomeCategories: profileData.income_categories || [],
      expenseCategories: profileData.expense_categories || [],
      projectTypes: profileData.project_types || [],
      eventTypes: profileData.event_types || [],
      assetCategories: profileData.asset_categories || [],
      sopCategories: profileData.sop_categories || [],
      projectStatusConfig: profileData.project_status_config || [],
      notificationSettings: profileData.notification_settings || {},
      securitySettings: profileData.security_settings || {},
      briefingTemplate: profileData.briefing_template,
      termsAndConditions: profileData.terms_and_conditions || '',
      contractTemplate: profileData.contract_template || '',
    },
    cards: cardsData.map(row => ({
      id: row.id,
      cardHolderName: row.card_holder_name,
      bankName: row.bank_name,
      cardType: row.card_type as any,
      lastFourDigits: row.last_four_digits,
      expiryDate: row.expiry_date || '',
      balance: row.balance,
      colorGradient: row.color_gradient,
    })),
  };
};

// Submit public booking form
export const submitPublicBooking = async (formData: any) => {
  // Create client
  const newClient = await api.createClient({
    name: formData.clientName,
    email: formData.email,
    phone: formData.phone,
    instagram: formData.instagram || '',
    since: new Date().toISOString().split('T')[0],
    status: 'Aktif' as any,
    clientType: 'Langsung' as any,
    lastContact: new Date().toISOString(),
    portalAccessId: crypto.randomUUID(),
  });

  // Create project
  const newProject = await api.createProject({
    projectName: formData.projectName,
    clientName: newClient.name,
    clientId: newClient.id,
    projectType: formData.projectType,
    packageName: formData.packageName,
    packageId: formData.packageId,
    addOns: formData.addOns || [],
    date: formData.date,
    deadlineDate: '',
    location: formData.location,
    progress: 0,
    status: 'Dikonfirmasi',
    activeSubStatuses: [],
    totalCost: formData.totalCost,
    amountPaid: formData.amountPaid || 0,
    paymentStatus: formData.paymentStatus,
    team: [],
    notes: formData.notes || '',
    accommodation: '',
    driveLink: '',
    clientDriveLink: '',
    finalDriveLink: '',
    startTime: '',
    endTime: '',
    image: '',
    revisions: [],
    promoCodeId: formData.promoCodeId || '',
    discountAmount: formData.discountAmount || 0,
    shippingDetails: '',
    dpProofUrl: formData.dpProofUrl || '',
    printingDetails: [],
    printingCost: 0,
    transportCost: 0,
    isEditingConfirmedByClient: false,
    isPrintingConfirmedByClient: false,
    isDeliveryConfirmedByClient: false,
    confirmedSubStatuses: [],
    clientSubStatusNotes: {},
    subStatusConfirmationSentAt: {},
    completedDigitalItems: [],
    invoiceSignature: '',
  });

  // Create transaction if DP was paid
  if (formData.amountPaid > 0) {
    await api.createTransaction({
      date: new Date().toISOString().split('T')[0],
      description: `DP Proyek ${newProject.projectName}`,
      amount: formData.amountPaid,
      type: 'Pemasukan' as any,
      projectId: newProject.id,
      category: 'DP Proyek',
      method: 'Transfer Bank' as any,
      pocketId: '',
      cardId: formData.cardId || '',
      printingItemId: '',
      vendorSignature: '',
    });

    // Update card balance
    if (formData.cardId) {
      const { data: cardData } = await supabase.from('cards').select('balance').eq('id', formData.cardId).single();
      if (cardData) {
        await supabase.from('cards').update({
          balance: cardData.balance + formData.amountPaid
        }).eq('id', formData.cardId);
      }
    }
  }

  // Create lead record
  await api.createLead({
    name: newClient.name,
    contactChannel: 'Website' as any,
    location: newProject.location,
    status: 'Dikonversi' as any,
    date: new Date().toISOString().split('T')[0],
    notes: `Dikonversi dari formulir booking. Proyek: ${newProject.projectName}`,
  });

  // Update promo code usage if used
  if (formData.promoCodeId) {
    const { data: promoData } = await supabase.from('promo_codes').select('usage_count').eq('id', formData.promoCodeId).single();
    if (promoData) {
      await supabase.from('promo_codes').update({
        usage_count: promoData.usage_count + 1
      }).eq('id', formData.promoCodeId);
    }
  }

  return { client: newClient, project: newProject };
};

// Submit public lead form
export const submitPublicLead = async (leadData: any) => {
  return await api.createLead({
    name: leadData.name,
    contactChannel: 'Website' as any,
    location: leadData.location,
    status: 'Sedang Diskusi' as any,
    date: new Date().toISOString().split('T')[0],
    notes: leadData.notes || '',
  });
};

// Submit public feedback
export const submitPublicFeedback = async (feedbackData: any) => {
  return await apiExtended.createClientFeedback({
    clientName: feedbackData.clientName,
    satisfaction: feedbackData.satisfaction,
    rating: feedbackData.rating,
    feedback: feedbackData.feedback,
    date: new Date().toISOString(),
  });
};

// Get client portal data
export const getClientPortalData = async (portalAccessId: string) => {
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('portal_access_id', portalAccessId)
    .single();

  if (clientError || !clientData) {
    throw new Error('Client not found');
  }

  const { data: projectsData } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientData.id);

  const { data: contractsData } = await supabase
    .from('contracts')
    .select('*')
    .eq('client_id', clientData.id);

  const { data: transactionsData } = await supabase
    .from('transactions')
    .select('*')
    .eq('project_id', projectsData?.[0]?.id);

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single();

  const { data: packagesData } = await supabase
    .from('packages')
    .select('*');

  return {
    client: {
      id: clientData.id,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      instagram: clientData.instagram || '',
      since: clientData.since,
      status: clientData.status as any,
      clientType: clientData.client_type as any,
      lastContact: clientData.last_contact,
      portalAccessId: clientData.portal_access_id,
    },
    projects: projectsData?.map(row => ({
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
    })) || [],
    contracts: contractsData?.map(row => ({
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
    })) || [],
    transactions: transactionsData?.map(row => ({
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
    })) || [],
    profile: profileData ? {
      fullName: profileData.full_name,
      email: profileData.email,
      phone: profileData.phone,
      companyName: profileData.company_name,
      website: profileData.website,
      address: profileData.address,
      bankAccount: profileData.bank_account,
      authorizedSigner: profileData.authorized_signer,
      idNumber: profileData.id_number || '',
      bio: profileData.bio,
      incomeCategories: profileData.income_categories || [],
      expenseCategories: profileData.expense_categories || [],
      projectTypes: profileData.project_types || [],
      eventTypes: profileData.event_types || [],
      assetCategories: profileData.asset_categories || [],
      sopCategories: profileData.sop_categories || [],
      projectStatusConfig: profileData.project_status_config || [],
      notificationSettings: profileData.notification_settings || {},
      securitySettings: profileData.security_settings || {},
      briefingTemplate: profileData.briefing_template,
      termsAndConditions: profileData.terms_and_conditions || '',
      contractTemplate: profileData.contract_template || '',
    } : null,
    cards: cardsData.map(row => ({
      id: row.id,
      cardHolderName: row.card_holder_name,
      bankName: row.bank_name,
      cardType: row.card_type as any,
      lastFourDigits: row.last_four_digits,
      expiryDate: row.expiry_date || '',
      balance: row.balance,
      colorGradient: row.color_gradient,
    })),
  };
};

// Get freelancer portal data
export const getFreelancerPortalData = async (portalAccessId: string) => {
  const { data: memberData, error: memberError } = await supabase
    .from('team_members')
    .select('*')
    .eq('portal_access_id', portalAccessId)
    .single();

  if (memberError || !memberData) {
    throw new Error('Freelancer not found');
  }

  const { data: projectsData } = await supabase
    .from('projects')
    .select('*')
    .contains('team', [{ memberId: memberData.id }]);

  const { data: paymentsData } = await supabase
    .from('team_project_payments')
    .select('*')
    .eq('team_member_id', memberData.id);

  const { data: paymentRecordsData } = await supabase
    .from('team_payment_records')
    .select('*')
    .eq('team_member_id', memberData.id);

  const { data: rewardEntriesData } = await supabase
    .from('reward_ledger_entries')
    .select('*')
    .eq('team_member_id', memberData.id);

  const { data: sopsData } = await supabase
    .from('sops')
    .select('*');

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single();

  return {
    teamMember: {
      id: memberData.id,
      name: memberData.name,
      role: memberData.role,
      email: memberData.email,
      phone: memberData.phone,
      standardFee: memberData.standard_fee,
      noRek: memberData.no_rek || '',
      rewardBalance: memberData.reward_balance,
      rating: memberData.rating,
      performanceNotes: memberData.performance_notes || [],
      portalAccessId: memberData.portal_access_id,
    },
    projects: projectsData?.map(row => ({
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
    })) || [],
    teamProjectPayments: paymentsData?.map(row => ({
      id: row.id,
      projectId: row.project_id,
      teamMemberName: row.team_member_name,
      teamMemberId: row.team_member_id,
      date: row.date,
      status: row.status as any,
      fee: row.fee,
      reward: row.reward || 0,
    })) || [],
    teamPaymentRecords: paymentRecordsData?.map(row => ({
      id: row.id,
      recordNumber: row.record_number,
      teamMemberId: row.team_member_id,
      date: row.date,
      projectPaymentIds: row.project_payment_ids,
      totalAmount: row.total_amount,
      vendorSignature: row.vendor_signature || '',
    })) || [],
    rewardLedgerEntries: rewardEntriesData?.map(row => ({
      id: row.id,
      teamMemberId: row.team_member_id,
      date: row.date,
      description: row.description,
      amount: row.amount,
      projectId: row.project_id || '',
    })) || [],
    sops: sopsData?.map(row => ({
      id: row.id,
      title: row.title,
      category: row.category,
      content: row.content,
      lastUpdated: row.last_updated,
    })) || [],
    profile: profileData ? {
      fullName: profileData.full_name,
      email: profileData.email,
      phone: profileData.phone,
      companyName: profileData.company_name,
      website: profileData.website,
      address: profileData.address,
      bankAccount: profileData.bank_account,
      authorizedSigner: profileData.authorized_signer,
      idNumber: profileData.id_number || '',
      bio: profileData.bio,
      incomeCategories: profileData.income_categories || [],
      expenseCategories: profileData.expense_categories || [],
      projectTypes: profileData.project_types || [],
      eventTypes: profileData.event_types || [],
      assetCategories: profileData.asset_categories || [],
      sopCategories: profileData.sop_categories || [],
      projectStatusConfig: profileData.project_status_config || [],
      notificationSettings: profileData.notification_settings || {},
      securitySettings: profileData.security_settings || {},
      briefingTemplate: profileData.briefing_template,
      termsAndConditions: profileData.terms_and_conditions || '',
      contractTemplate: profileData.contract_template || '',
    } : null,
  };
};

// Update project revision (for freelancer portal)
export const updateProjectRevision = async (projectId: string, revisionId: string, updatedData: {
  freelancerNotes: string;
  driveLink: string;
  status: RevisionStatus;
}) => {
  const { data: projectData, error: fetchError } = await supabase
    .from('projects')
    .select('revisions')
    .eq('id', projectId)
    .single();

  if (fetchError) throw fetchError;

  const revisions = projectData.revisions || [];
  const updatedRevisions = revisions.map((rev: any) => {
    if (rev.id === revisionId) {
      return {
        ...rev,
        freelancerNotes: updatedData.freelancerNotes,
        driveLink: updatedData.driveLink,
        status: updatedData.status,
        completedDate: updatedData.status === RevisionStatus.COMPLETED ? new Date().toISOString() : rev.completedDate,
      };
    }
    return rev;
  });

  const { error: updateError } = await supabase
    .from('projects')
    .update({ revisions: updatedRevisions })
    .eq('id', projectId);

  if (updateError) throw updateError;
};

// Update contract signature
export const updateContractSignature = async (contractId: string, signatureDataUrl: string, signer: 'vendor' | 'client') => {
  const updateData = signer === 'vendor' 
    ? { vendor_signature: signatureDataUrl }
    : { client_signature: signatureDataUrl };

  const { error } = await supabase
    .from('contracts')
    .update(updateData)
    .eq('id', contractId);

  if (error) throw error;
};

// Update project client confirmations
export const updateProjectClientConfirmation = async (projectId: string, stage: 'editing' | 'printing' | 'delivery') => {
  const updateData: any = {};
  if (stage === 'editing') updateData.is_editing_confirmed_by_client = true;
  if (stage === 'printing') updateData.is_printing_confirmed_by_client = true;
  if (stage === 'delivery') updateData.is_delivery_confirmed_by_client = true;

  const { error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', projectId);

  if (error) throw error;
};

// Update project sub-status confirmation
export const updateProjectSubStatusConfirmation = async (projectId: string, subStatusName: string, note: string) => {
  const { data: projectData, error: fetchError } = await supabase
    .from('projects')
    .select('confirmed_sub_statuses, client_sub_status_notes')
    .eq('id', projectId)
    .single();

  if (fetchError) throw fetchError;

  const confirmedSubStatuses = [...(projectData.confirmed_sub_statuses || []), subStatusName];
  const clientSubStatusNotes = { ...(projectData.client_sub_status_notes || {}), [subStatusName]: note };

  const { error: updateError } = await supabase
    .from('projects')
    .update({
      confirmed_sub_statuses: confirmedSubStatuses,
      client_sub_status_notes: clientSubStatusNotes,
    })
    .eq('id', projectId);

  if (updateError) throw updateError;
};