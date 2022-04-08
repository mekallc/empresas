import { ExpertEffects } from './expert.effects';
import { CustomerEffects } from './customer.effects';
import { StripeEffects } from './stripe.effects';
import { ClosedEffects } from './closed.effects';
import { AcceptedEffects } from './accepted.effects';
import { HistoryEffects } from './history.effects';
import { CompanyEffects } from './company.effects';
import { InProcessEffects } from './in-process.effects';


export const EffectsArray: any[] = [
  CompanyEffects, InProcessEffects, HistoryEffects, AcceptedEffects,
  ClosedEffects, StripeEffects, CustomerEffects, ExpertEffects
];
