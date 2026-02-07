// Location data: Country -> Cities/Provinces
const LOCATIONS = {
    "Canada": [
        "Toronto, Ontario",
        "Vancouver, British Columbia",
        "Montreal, Quebec",
        "Calgary, Alberta",
        "Edmonton, Alberta",
        "Ottawa, Ontario",
        "Winnipeg, Manitoba",
        "Mississauga, Ontario",
        "Brampton, Ontario",
        "Hamilton, Ontario",
        "Quebec City, Quebec",
        "Surrey, British Columbia",
        "Halifax, Nova Scotia",
        "London, Ontario",
        "Kitchener, Ontario",
        "Waterloo, Ontario",
        "Ontario (Province)",
        "British Columbia (Province)",
        "Alberta (Province)",
        "Quebec (Province)"
    ],
    "United States": [
        "New York, NY",
        "San Francisco, CA",
        "Los Angeles, CA",
        "Seattle, WA",
        "Austin, TX",
        "Boston, MA",
        "Chicago, IL",
        "Denver, CO",
        "Atlanta, GA",
        "Miami, FL",
        "Dallas, TX",
        "Houston, TX",
        "Phoenix, AZ",
        "San Diego, CA",
        "San Jose, CA",
        "Portland, OR",
        "Washington, DC",
        "Philadelphia, PA",
        "Raleigh, NC",
        "Charlotte, NC",
        "California (State)",
        "Texas (State)",
        "New York (State)",
        "Washington (State)"
    ],
    "United Kingdom": [
        "London",
        "Manchester",
        "Birmingham",
        "Edinburgh",
        "Glasgow",
        "Bristol",
        "Leeds",
        "Liverpool",
        "Sheffield",
        "Newcastle",
        "Cambridge",
        "Oxford",
        "Brighton",
        "Nottingham",
        "Cardiff",
        "Belfast"
    ],
    "Australia": [
        "Sydney, NSW",
        "Melbourne, VIC",
        "Brisbane, QLD",
        "Perth, WA",
        "Adelaide, SA",
        "Canberra, ACT",
        "Gold Coast, QLD",
        "Newcastle, NSW",
        "Hobart, TAS"
    ],
    "Germany": [
        "Berlin",
        "Munich",
        "Hamburg",
        "Frankfurt",
        "Cologne",
        "Stuttgart",
        "Düsseldorf",
        "Leipzig",
        "Dresden",
        "Hannover"
    ],
    "India": [
        "Bangalore",
        "Mumbai",
        "Delhi NCR",
        "Hyderabad",
        "Chennai",
        "Pune",
        "Kolkata",
        "Ahmedabad",
        "Gurgaon",
        "Noida"
    ],
    "Remote": [
        "Remote - Worldwide",
        "Remote - Americas",
        "Remote - Europe",
        "Remote - Asia Pacific"
    ]
};

// Function to get cities for a country
function getCitiesForCountry(country) {
    return LOCATIONS[country] || [];
}
