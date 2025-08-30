import React from 'react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import * as PricingCard from './ui/pricing-card';
import {
	CheckCircle2,
	XCircleIcon,
	Users,
} from 'lucide-react';


function PricingCardDemo() {
	const handleClick = (plan: string) => {
		alert(`Selected ${plan} plan!`);
	};

	const features = [
		'Up to 3 projects',
		'Basic templates',
		'Community support',
		'1GB storage',
	];

	const lockedFeatures = [
		'Unlimited projects',
		'Premium templates',
		'Priority support',
	];

	return (
		<PricingCard.Card>
			<PricingCard.Header>
				<PricingCard.Plan>
					<PricingCard.PlanName>
						<Users aria-hidden="true" />
						<span className="text-muted-foreground">Starter</span>
					</PricingCard.PlanName>
					<PricingCard.Badge>For Individuals</PricingCard.Badge>
				</PricingCard.Plan>
				<PricingCard.Price>
					<PricingCard.MainPrice>$10</PricingCard.MainPrice>
					<PricingCard.Period>/ month</PricingCard.Period>
					<PricingCard.OriginalPrice className="ml-auto">
						$12
					</PricingCard.OriginalPrice>
				</PricingCard.Price>
				<Button
					className={cn(
						'w-full font-semibold text-white',
						'bg-gradient-to-b from-orange-500 to-orange-600 shadow-[0_10px_25px_rgba(255,115,0,0.3)]',
					)}
					onClick={() => handleClick('Starter')}
				>
					Get Started
				</Button>
			</PricingCard.Header>
			<PricingCard.Body>
				<PricingCard.List>
					{features.map((item, i) => (
						<PricingCard.ListItem key={i}>
							<span className="mt-0.5">
								<CheckCircle2
									className="h-4 w-4 text-green-500"
									aria-hidden="true"
								/>
							</span>
							<span>{item}</span>
						</PricingCard.ListItem>
					))}
				</PricingCard.List>
				<PricingCard.Separator>Pro features</PricingCard.Separator>
				<PricingCard.List>
					{lockedFeatures.map((item, i) => (
						<PricingCard.ListItem key={i} className="opacity-75">
							<span className="mt-0.5">
								<XCircleIcon
									className="text-destructive h-4 w-4"
									aria-hidden="true"
								/>
							</span>
							<span>{item}</span>
						</PricingCard.ListItem>
					))}
				</PricingCard.List>
			</PricingCard.Body>
		</PricingCard.Card>
	);
}


export default PricingCardDemo;
