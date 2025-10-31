interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <p className="text-red-500 text-sm sm:text-base md:text-lg p-2 sm:p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            {message}
        </p>
    );
}

