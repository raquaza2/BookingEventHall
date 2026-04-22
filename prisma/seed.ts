import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultVenue = {
  slug: "grand-aurora-hall",
  name: "Grand Aurora Hall",
  tagline: "A bright, elegant venue designed for weddings, launches, and unforgettable celebrations.",
  description:
    "Grand Aurora Hall balances polished hospitality with practical event flow. Guests arrive through a landscaped courtyard, move into a double-height reception foyer, and gather in a hall designed for dinners, ceremonies, and branded activations.",
  location: "Damansara Heights, Kuala Lumpur",
  capacity: 320,
  priceLabel: "From RM 4,800 per event block",
  heroImage:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80",
  galleryImages: JSON.stringify([
    "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80"
  ]),
  amenities: JSON.stringify([
    "Banquet-ready main hall",
    "Bridal and prep suite",
    "AV system with wireless microphones",
    "On-site parking and valet zone",
    "Flexible lounge and registration area",
    "Vendor loading access"
  ]),
  houseRules: JSON.stringify([
    "Bookings are confirmed only after admin approval.",
    "Outside catering is allowed with prior coordination.",
    "Events must conclude by 11:00 PM.",
    "Decor installs must follow venue safety guidelines."
  ])
};

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@grandaurora.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.venue.upsert({
    where: { slug: defaultVenue.slug },
    update: defaultVenue,
    create: defaultVenue
  });

  await prisma.adminUser.upsert({
    where: { email },
    update: {
      name: "Venue Admin",
      passwordHash
    },
    create: {
      email,
      name: "Venue Admin",
      passwordHash
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
