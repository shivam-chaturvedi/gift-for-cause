import { motion } from "framer-motion"
import { Heart, MapPin, Calendar, Users } from "lucide-react"

// Mock success stories data
const stories = [
  {
    id: "1",
    title: "Priya's Dream School",
    subtitle: "How birthday donations built a library",
    description: "Instead of traditional gifts, Priya asked friends to donate books for her 16th birthday. The response was overwhelming - they raised enough to build a complete library for a rural school in Rajasthan.",
    image: "/api/placeholder/600/400",
    donorName: "Priya Sharma",
    location: "Mumbai, India",
    ngoName: "Education First Foundation",
    impact: "200+ children now have access to books",
    amount: "₹45,000",
    date: "December 2023",
    category: "Education"
  },
  {
    id: "2", 
    title: "The Wedding That Changed Lives",
    subtitle: "Anniversary celebration becomes clean water mission",
    description: "For their 25th wedding anniversary, the Patels decided to install water purification systems in their ancestral village instead of throwing a grand party. The celebration turned into a life-changing gift for the entire community.",
    image: "/api/placeholder/600/400",
    donorName: "Raj & Meera Patel",
    location: "Gujarat, India", 
    ngoName: "Water for All",
    impact: "500+ people get clean water daily",
    amount: "₹75,000",
    date: "November 2023",
    category: "Water & Sanitation"
  },
  {
    id: "3",
    title: "Diwali Lights of Hope",
    subtitle: "Festival celebration empowers women",
    description: "The Kumar family decided to celebrate Diwali by funding sewing machine training for women in rural Karnataka. This Diwali gift continues to shine as these women now run successful tailoring businesses.",
    image: "/api/placeholder/600/400",
    donorName: "Kumar Family",
    location: "Bangalore, India",
    ngoName: "Women Empowerment Trust", 
    impact: "25 women became entrepreneurs",
    amount: "₹30,000",
    date: "October 2023",
    category: "Women Empowerment"
  },
  {
    id: "4",
    title: "Baby Shower for a Cause",
    subtitle: "New life celebration saves other lives",
    description: "When expecting their first child, the Mishras used their baby shower to raise funds for a neonatal care unit in a rural hospital. Their joy multiplied as they helped save newborn lives.",
    image: "/api/placeholder/600/400",
    donorName: "Ankit & Shreya Mishra",
    location: "Delhi, India",
    ngoName: "Health Access Initiative",
    impact: "50+ newborns received critical care",
    amount: "₹60,000", 
    date: "September 2023",
    category: "Healthcare"
  },
  {
    id: "5",
    title: "Graduation Gift That Keeps Giving",
    subtitle: "Student success lights up villages",
    description: "Fresh graduate Arjun used his graduation party budget to provide solar lamps to students in remote areas. His achievement celebration became an opportunity for other students to achieve their dreams.",
    image: "/api/placeholder/600/400",
    donorName: "Arjun Reddy",
    location: "Hyderabad, India",
    ngoName: "Bright Future NGO",
    impact: "100+ students can study after dark",
    amount: "₹25,000",
    date: "August 2023", 
    category: "Education"
  },
  {
    id: "6",
    title: "Retirement Celebration with Purpose",
    subtitle: "Career milestone feeds the hungry",
    description: "Celebrating 35 years of service, Mr. Gupta chose to sponsor a nutrition program for underprivileged children instead of hosting a retirement party. His career legacy continues through healthy young minds.",
    image: "/api/placeholder/600/400",
    donorName: "Ramesh Gupta",
    location: "Pune, India",
    ngoName: "Feed the Future",
    impact: "300+ children receive daily meals",
    amount: "₹40,000",
    date: "July 2023",
    category: "Nutrition"
  }
]

const SuccessStories = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background to-accent-light/20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Success Stories
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Real stories of how celebrations became catalysts for change. 
              Discover how ordinary moments created extraordinary impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`relative overflow-hidden rounded-2xl shadow-medium ${
                    index % 2 === 1 ? 'lg:col-start-2' : ''
                  }`}
                >
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {story.category}
                    </span>
                  </div>
                </motion.div>

                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                      {story.title}
                    </h2>
                    <h3 className="text-lg text-primary font-medium">
                      {story.subtitle}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {story.description}
                    </p>
                  </div>

                  {/* Donor Info */}
                  <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{story.donorName}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{story.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{story.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-accent-light/20 rounded-xl">
                      <div className="text-2xl font-bold text-accent-foreground">
                        {story.amount}
                      </div>
                      <div className="text-sm text-muted-foreground">Donated</div>
                    </div>
                    <div className="text-center p-4 bg-secondary-light/20 rounded-xl">
                      <div className="text-sm font-medium text-secondary">
                        {story.ngoName}
                      </div>
                      <div className="text-xs text-muted-foreground">Partner NGO</div>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-xl">
                      <div className="text-sm font-medium text-primary text-center">
                        {story.impact}
                      </div>
                      <div className="text-xs text-muted-foreground">Impact Created</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Create Your Own Success Story
            </h2>
            <p className="text-lg text-muted-foreground">
              Every celebration is an opportunity to create lasting change. 
              Start your journey today and become part of our impact community.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button className="hero-gradient text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-medium hover:shadow-strong transition-all duration-300">
                Start Making Impact
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default SuccessStories