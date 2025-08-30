// src/utils/format.ts

export class FormatUtils {
    static formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    static formatCurrency(amount: number): string {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    static scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}