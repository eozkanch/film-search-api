🎥 Film Search Application
<img src="https://github.com/eozkanch/film-search-api/blob/main/public/filter-feature.jpeg"  witdth ="400px">


Description

The Film Search Application is a user-friendly platform that allows users to search for movies, TV shows, or filter results by year. Built with Next.js, MUI, and React, the app integrates with the OMDb API for a seamless experience. It incorporates clean code principles for maintainability and performance.
You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

🚀 Features

	1.	User-Friendly Search: Quickly search for movies and TV shows.
	2.	Dynamic Filtering: Filter results by year and movie type.
	3.	Pagination: Navigate through large datasets with ease.
	4.	Responsive Design: Works flawlessly across devices, from mobile to desktop.
	5.	Error Handling: Graceful error messages for a seamless user experience.
	6.	Loading States: Optimized spinner animations during data fetches.
	7.	API Integration: Fetches data from OMDb API for comprehensive movie details.
	8.	Performance Optimization: Efficient state and component management.
	9.	Clean Code: Modular, reusable, and well-documented components.
🛠️ Tech Stack

	•	Frontend: Next.js (React framework)
	•	Styling: MUI (Material-UI), Tailwind CSS
	•	API: OMDb API
	•	State Management: React Hooks
	•	Icons: MUI Icons

🔧 Installation

    Follow these steps to set up the project locally:
	1.	Clone the repository: git clone https://gitlab.com/<username>/film-search-app.git
    2.	Navigate to the project folder:cd film-search-app
    3.	Install dependencies:npm install
    4.	Add API Key:
	•	Create a .env.local file in the root directory.
	•	Add your OMDb API key:NEXT_PUBLIC_OMDB_API_KEY=your_api_key_here
    5.	Run the development server:npm run dev
   	6.	Access the app:
	•	Open your browser and navigate to http://localhost:3000.
🖼️ UI Structure

    Key Components:

        •	Search Page:
        •	Search bar for entering queries.
        •	Filter options (e.g., year).
        •	Pagination for navigating through results.
        •	Movie Details Page:
        •	Displays detailed information about a selected movie or show.
        •	Backdrop image for aesthetic appeal.

    Component Breakdown:

        •	MoviesPage: Handles the search and listing of movies.
        •	MovieCard: Displays individual movie data.
        •	Pagination: Manages navigation between pages.
        •	LoadingSpinner: Visual feedback during API calls.     
📜 Code Highlights

     Clean Code Principles

	•	Modular Design: Each feature is implemented as a reusable component.
	•	Error Handling: Proper validation and fallback mechanisms for API failures.
	•	Responsive Styling: Ensures consistent UI across various screen sizes.
	•	State Management: Controlled via React Hooks (e.g., useState, useEffect).   
    Code Example: Dynamic Movie Fetch

            const fetchMovies = async (currentPage = 1) => {
                setLoading(true);
                setError(null);
                try {
                    const { movies: fetchedMovies, totalResults } = await fetchFilteredMovies(
                    { ...filters, year: debouncedYear },
                    currentPage
                    );
                    setMovies(fetchedMovies);
                    setTotalPages(Math.ceil(totalResults / 10)); // OMDb API: 10 results per page
                } catch (err) {
                    setError(err.message);
                    setMovies([]);
                } finally {
                    setLoading(false);
                }
                };
🌟 Features in Detail

        Search & Filter

            •	Dynamic input fields for searching movies and filtering by year.
            •	Input validation for proper year formats.

        Pagination

            •	Smooth navigation through large datasets with page numbers.

        Error Handling

            •	Friendly messages for empty results or API errors.

        Optimized Loading

            •	Responsive spinner animations ensure smooth user experience during data fetches.

        Responsive Design

            •	Tailored for all screen sizes, from mobile to desktop.
🔍 Search Features

	•	Keyword Search: Enter movie or TV show names.
	•	Year Filter: Specify a 4-digit year for more targeted results.
	•	Pagination: View results in batches of 10.   
🚀 Deployment

The app is deployed on Vercel, making it scalable and lightning-fast.
	1.	Commit changes: git add .
                        git commit -m "Your commit message"
                        git push origin main  
	2.	Deploy using Vercel:
	•	Connect your repository to Vercel.
	•	Configure environment variables (NEXT_PUBLIC_OMDB_API_KEY).
	•	Deploy the app with a single click.      

📈 Performance Optimizations

	1.	Debounced Input: Reduces unnecessary API calls for every keystroke.
	2.	Error Boundaries: Displays fallback UI during API failures.
	3.	Lazy Loading: Optimized loading of movie details and images.



🛡️ Security

	•	API key is securely stored in .env.local.
	•	Sensitive information excluded from commits via .gitignore.

💡 Future Enhancements

	1.	Add user authentication for personalized movie lists.
	2.	Introduce genre-based filtering.
	3.	Implement dark mode for enhanced accessibility.
👥 Contributing

Contributions are welcome! Please follow the steps below:
	1.	Fork the repository.
	2.	Create a feature branch: git checkout -b feature-name 
                                 git commit -m "Feature description"  
                                 git push origin feature-name     

5.	Create a pull request.

📧 Contact

For any questions or feedback, feel free to reach out:
	
	•	GitLab: (https://gitlab-heg.sh1.hidora.com/BEKOZ)

By adhering to clean code principles, this project ensures a maintainable, scalable, and performant application. 🌟
