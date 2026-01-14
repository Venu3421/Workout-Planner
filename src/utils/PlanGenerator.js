import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const generatePlan = async (data) => {
    if (!genAI) {
        console.warn("Gemini API Key missing. Falling back to static logic.");
        return generateStaticPlan(data);
    }

    try {
        // Using 'gemini-2.5-flash' based on your available models list.
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are an expert AI fitness coach specializing in student-friendly, affordable workout and diet plans.
            User Profile:
            - Name: ${data.name}
            - Age: ${data.age}
            - Gender: ${data.gender}
            - Height: ${data.height}cm
            - Weight: ${data.weight}kg
            - Fitness Level: ${data.fitnessLevel}
            - Goal: ${data.goal}
            - Location: ${data.location} (e.g. home, hostel, gym)
            - Budget: ${data.budget} (low/medium/high)
            - Diet Type: ${data.dietType}
            - Region: ${data.region}
            - Allergies: ${data.allergies || 'None'}

            Generate a personalized plan strictly in the following JSON format:
            {
                "summary": "String",
                "workout": {
                    "schedule": [
                        { "day": "Monday", "activity": "String", "exercises": ["String", "String"], "tips": "String" },
                        ...7 days
                    ],
                    "progression": "String"
                },
                "diet": {
                    "dailyMeals": {
                        "breakfast": "String",
                        "lunch": "String",
                        "snack": "String",
                        "dinner": "String"
                    },
                    "budgetTips": ["String", "String"],
                    "reasoning": "String"
                },
                "tips": ["String", "String"]
            }

            Rules:
            1. Response must be valid JSON only.
            2. For 'hostel' location, suggest compact or bodyweight exercises.
            3. For 'low' budget, suggest affordable protein sources like soya, eggs, or lentils.
            4. Include regional food preferences (${data.region}).
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from potential markdown code blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error("Failed to parse AI response as JSON");

    } catch (error) {
        console.error("AI Generation Error:", error);
        return generateStaticPlan(data);
    }
};

// --- Fallback Static Logic ---

const generateStaticPlan = (data) => {
    const { fitnessLevel, goal, location, budget, dietType, region } = data;

    const workoutPlan = generateWorkout(fitnessLevel, location);
    const dietPlan = generateDiet(data);

    return {
        summary: `${data.name}, looking for ${goal} as a ${fitnessLevel} at ${location}.`,
        workout: workoutPlan,
        diet: dietPlan,
        tips: [
            "Maintain a consistent sleep cycle (7-8 hours).",
            "Hydrate well: at least 3-4 liters of water daily.",
            "Focus on form over weight to avoid injuries.",
            "Stay active on rest days with light walking."
        ]
    };
};

const generateWorkout = (level, location) => {
    const sessions = {
        "Beginner": [
            { day: "Monday", activity: "Full Body Bodyweight", exercises: ["Pushups", "Squats", "Plank"], tips: "Focus on form." },
            { day: "Tuesday", activity: "Rest & Active Recovery", exercises: ["Light walking: 30 mins"], tips: "Stay active." },
            { day: "Wednesday", activity: "Cardio & Core", exercises: ["Jumping Jacks", "Crunches"], tips: "Keep breathing." },
            { day: "Thursday", activity: "Rest", exercises: [], tips: "" },
            { day: "Friday", activity: "Strength Focus", exercises: ["Lunges", "Glute Bridges"], tips: "Steady pace." },
            { day: "Saturday", activity: "Mobility & Stretching", exercises: ["Yoga flow: 20 mins"], tips: "Relax your muscles." },
            { day: "Sunday", activity: "Rest", exercises: [], tips: "" }
        ],
        "Intermediate": [
            { day: "Monday", activity: "Upper Body Focus", exercises: ["Diamond Pushups", "Pullups/Rows"], tips: "Increase resistance if possible." },
            { day: "Tuesday", activity: "Lower Body Focus", exercises: ["Bulgarian Split Squats", "Calf Raises"], tips: "Drive with power." },
            { day: "Wednesday", activity: "HIIT Session", exercises: ["Burpees", "Mountain Climbers"], tips: "High intensity." },
            { day: "Thursday", activity: "Rest", exercises: [], tips: "" },
            { day: "Friday", activity: "Compound Moves", exercises: ["Pike Pushups", "Archer Squats"], tips: "Control the movement." },
            { day: "Saturday", activity: "Skill Practice", exercises: ["Handstand work"], tips: "Practice balance." },
            { day: "Sunday", activity: "Rest", exercises: [], tips: "" }
        ]
    };

    const planData = sessions[level] || sessions["Beginner"];

    const adaptedPlan = planData.map(s => ({
        ...s,
        activity: location === 'hostel' ? s.activity + " (Compact)" :
            location === 'gym' ? s.activity + " (Weights)" : s.activity,
        exercises: s.exercises.map(ex => {
            const sets = Math.floor(Math.random() * 2) + 3;
            const reps = level === "Beginner" ? "10-12" : "12-15";
            return `${ex}: ${sets}x${reps} (60s rest)`;
        })
    }));

    const progressionTip = level === "Beginner" ?
        "Progression: Add 1 rep to every set each week." :
        "Progression: Reduce rest time by 5s every week.";

    return { schedule: adaptedPlan, progression: progressionTip };
};

const generateDiet = (data) => {
    const { dietType, region, budget, goal, weight, height, age, gender, allergies } = data;

    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr = gender === 'Male' ? bmr + 5 : bmr - 161;
    const activityMultiplier = 1.4;
    let tdee = bmr * activityMultiplier;

    const targetCals = goal === 'Fat loss' ? tdee - 500 : goal === 'Muscle gain' ? tdee + 400 : tdee;

    const foodDB = {
        "North Indian": {
            carbs: ["Poha", "Dalia", "Whole Wheat Roti", "Brown Rice", "Oats"],
            protein: {
                "Vegetarian": ["Paneer Sabzi", "Mixed Dal", "Rajma", "Chole"],
                "Non-Vegetarian": ["Chicken Curry", "Egg Bhurji", "Fish Fry", "Mutton (Limited)"],
                "Vegan": ["Tofu Scramble", "Soya Chunks Curry", "Chickpea Salad", "Lentil Soup"],
                "Eggetarian": ["Egg Curry", "Omelette", "Paneer", "Dal"]
            },
            sides: ["Curd", "Green Chutney", "Raita", "Salad"]
        },
        "South Indian": {
            carbs: ["Idli", "Dosa", "Ragi Mudde", "Red Rice", "Upma"],
            protein: {
                "Vegetarian": ["Sambar with Veggies", "Kootu", "Sprouted Moong Salad", "Buttermilk"],
                "Non-Vegetarian": ["Fish Curry", "Chicken Chettinad", "Egg Roast", "Prawn Roast"],
                "Vegan": ["Coconut Milk Stew", "Sundal", "Moong Dal Payasam (No Milk)", "Peanut Podi"],
                "Eggetarian": ["Egg Appam", "Egg Dosa", "Sambar", "Sprouts"]
            },
            sides: ["Coconut Chutney", "Poriyal", "Pickle", "Papad"]
        }
    };

    const selectedRegion = foodDB[region] || foodDB["North Indian"];
    const proteinOptions = selectedRegion.protein[dietType] || selectedRegion.protein["Vegetarian"];

    const portionSize = goal === 'Muscle gain' ? 'Large portion' : 'Moderate portion';

    const pick = (arr) => {
        const filtered = allergies ? arr.filter(item => !item.toLowerCase().includes(allergies.toLowerCase())) : arr;
        return filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : arr[0];
    };

    const meals = {
        breakfast: `${pick(selectedRegion.carbs)} with ${dietType === 'Non-Vegetarian' ? 'Boiled Eggs' : 'Nuts'} - ${portionSize}.`,
        lunch: `${pick(proteinOptions)}, ${pick(selectedRegion.carbs)}, and ${pick(selectedRegion.sides)}.`,
        snack: `${budget === 'high' ? 'Greek Yogurt / Whey' : 'Roasted Chana / Sprouts'} with tea/coffee.`,
        dinner: `Light ${pick(proteinOptions)} with steamed veggies and ${pick(selectedRegion.sides)}.`
    };

    const reasoning = `Optimized for ${targetCals.toFixed(0)} kcal. High ${goal === 'Muscle gain' ? 'protein' : 'fiber'} focus to support your ${goal} journey.`;

    const budgetTips = budget === 'low' ?
        ["Buy grains in bulk.", "Soya chunks are the cheapest protein - use them 3x/week.", "Use seasonal veggies."] :
        ["Invest in high-quality Whey protein.", "Include Avocado or Seeds for healthy fats.", "Meal prep to save time."];

    return {
        dailyMeals: meals,
        budgetTips: budgetTips,
        reasoning: reasoning
    };
};
