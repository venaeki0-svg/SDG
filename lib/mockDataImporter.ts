import { supabase } from './supabase';
import * as api from './api';
import * as apiExtended from './api-extended';
import { 
  MOCK_CLIENTS, MOCK_PROJECTS, MOCK_TEAM_MEMBERS, MOCK_TRANSACTIONS, 
  MOCK_PACKAGES, MOCK_ADDONS, MOCK_TEAM_PROJECT_PAYMENTS, MOCK_USER_PROFILE, 
  MOCK_FINANCIAL_POCKETS, MOCK_TEAM_PAYMENT_RECORDS, MOCK_LEADS, 
  MOCK_REWARD_LEDGER_ENTRIES, MOCK_USERS, MOCK_CARDS, MOCK_ASSETS, 
  MOCK_CLIENT_FEEDBACK, MOCK_CONTRACTS, MOCK_NOTIFICATIONS, 
  MOCK_SOCIAL_MEDIA_POSTS, MOCK_PROMO_CODES, MOCK_SOPS 
} from '../constants';

export const importMockData = async () => {
  try {
    console.log('Starting mock data import...');

    // Import users first
    for (const user of MOCK_USERS) {
      try {
        await api.createUser(user);
        console.log(`Created user: ${user.email}`);
      } catch (error) {
        console.log(`User ${user.email} might already exist, skipping...`);
      }
    }

    // Import packages
    for (const pkg of MOCK_PACKAGES) {
      try {
        await api.createPackage(pkg);
        console.log(`Created package: ${pkg.name}`);
      } catch (error) {
        console.log(`Package ${pkg.name} might already exist, skipping...`);
      }
    }

    // Import add-ons
    for (const addOn of MOCK_ADDONS) {
      try {
        await api.createAddOn(addOn);
        console.log(`Created add-on: ${addOn.name}`);
      } catch (error) {
        console.log(`Add-on ${addOn.name} might already exist, skipping...`);
      }
    }

    // Import team members
    for (const member of MOCK_TEAM_MEMBERS) {
      try {
        await api.createTeamMember(member);
        console.log(`Created team member: ${member.name}`);
      } catch (error) {
        console.log(`Team member ${member.name} might already exist, skipping...`);
      }
    }

    // Import clients
    for (const client of MOCK_CLIENTS) {
      try {
        await api.createClient(client);
        console.log(`Created client: ${client.name}`);
      } catch (error) {
        console.log(`Client ${client.name} might already exist, skipping...`);
      }
    }

    // Import projects
    for (const project of MOCK_PROJECTS) {
      try {
        await api.createProject(project);
        console.log(`Created project: ${project.projectName}`);
      } catch (error) {
        console.log(`Project ${project.projectName} might already exist, skipping...`);
      }
    }

    // Import cards
    for (const card of MOCK_CARDS) {
      try {
        await api.createCard(card);
        console.log(`Created card: ${card.bankName}`);
      } catch (error) {
        console.log(`Card ${card.bankName} might already exist, skipping...`);
      }
    }

    // Import financial pockets
    for (const pocket of MOCK_FINANCIAL_POCKETS) {
      try {
        await api.createFinancialPocket(pocket);
        console.log(`Created pocket: ${pocket.name}`);
      } catch (error) {
        console.log(`Pocket ${pocket.name} might already exist, skipping...`);
      }
    }

    // Import transactions
    for (const transaction of MOCK_TRANSACTIONS) {
      try {
        await api.createTransaction(transaction);
        console.log(`Created transaction: ${transaction.description}`);
      } catch (error) {
        console.log(`Transaction might already exist, skipping...`);
      }
    }

    // Import leads
    for (const lead of MOCK_LEADS) {
      try {
        await api.createLead(lead);
        console.log(`Created lead: ${lead.name}`);
      } catch (error) {
        console.log(`Lead ${lead.name} might already exist, skipping...`);
      }
    }

    // Import team project payments
    for (const payment of MOCK_TEAM_PROJECT_PAYMENTS) {
      try {
        await apiExtended.createTeamProjectPayment(payment);
        console.log(`Created team payment: ${payment.teamMemberName}`);
      } catch (error) {
        console.log(`Team payment might already exist, skipping...`);
      }
    }

    // Import team payment records
    for (const record of MOCK_TEAM_PAYMENT_RECORDS) {
      try {
        await apiExtended.createTeamPaymentRecord(record);
        console.log(`Created payment record: ${record.recordNumber}`);
      } catch (error) {
        console.log(`Payment record might already exist, skipping...`);
      }
    }

    // Import reward ledger entries
    for (const entry of MOCK_REWARD_LEDGER_ENTRIES) {
      try {
        await apiExtended.createRewardLedgerEntry(entry);
        console.log(`Created reward entry: ${entry.description}`);
      } catch (error) {
        console.log(`Reward entry might already exist, skipping...`);
      }
    }

    // Import assets
    for (const asset of MOCK_ASSETS) {
      try {
        await apiExtended.createAsset(asset);
        console.log(`Created asset: ${asset.name}`);
      } catch (error) {
        console.log(`Asset ${asset.name} might already exist, skipping...`);
      }
    }

    // Import client feedback
    for (const feedback of MOCK_CLIENT_FEEDBACK) {
      try {
        await apiExtended.createClientFeedback(feedback);
        console.log(`Created feedback from: ${feedback.clientName}`);
      } catch (error) {
        console.log(`Feedback might already exist, skipping...`);
      }
    }

    // Import contracts
    for (const contract of MOCK_CONTRACTS) {
      try {
        await apiExtended.createContract(contract);
        console.log(`Created contract: ${contract.contractNumber}`);
      } catch (error) {
        console.log(`Contract might already exist, skipping...`);
      }
    }

    // Import notifications
    for (const notification of MOCK_NOTIFICATIONS) {
      try {
        await apiExtended.createNotification(notification);
        console.log(`Created notification: ${notification.title}`);
      } catch (error) {
        console.log(`Notification might already exist, skipping...`);
      }
    }

    // Import social media posts
    for (const post of MOCK_SOCIAL_MEDIA_POSTS) {
      try {
        await apiExtended.createSocialMediaPost(post);
        console.log(`Created social media post for: ${post.clientName}`);
      } catch (error) {
        console.log(`Social media post might already exist, skipping...`);
      }
    }

    // Import promo codes
    for (const promoCode of MOCK_PROMO_CODES) {
      try {
        await apiExtended.createPromoCode(promoCode);
        console.log(`Created promo code: ${promoCode.code}`);
      } catch (error) {
        console.log(`Promo code might already exist, skipping...`);
      }
    }

    // Import SOPs
    for (const sop of MOCK_SOPS) {
      try {
        await apiExtended.createSOP(sop);
        console.log(`Created SOP: ${sop.title}`);
      } catch (error) {
        console.log(`SOP might already exist, skipping...`);
      }
    }

    // Import profile
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await apiExtended.createProfile(user.id, MOCK_USER_PROFILE);
        console.log('Created user profile');
      }
    } catch (error) {
      console.log('Profile might already exist, skipping...');
    }

    console.log('Mock data import completed!');
    return true;
  } catch (error) {
    console.error('Error importing mock data:', error);
    throw error;
  }
};