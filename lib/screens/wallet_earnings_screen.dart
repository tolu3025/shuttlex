import 'package:flutter/material.dart';
import '../constants/theme.dart';

class WalletEarningsScreen extends StatelessWidget {
  const WalletEarningsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ShuttleXColors.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: ShuttleXColors.border),
            ),
            child: const Icon(Icons.arrow_back, size: 16, color: ShuttleXColors.primary),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Campus Wallet & Paystack",
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 17,
            letterSpacing: -0.4,
            color: ShuttleXColors.primary,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Balance Card
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [ShuttleXColors.primary, ShuttleXColors.forestDeep],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                      color: ShuttleXColors.primary.withOpacity(0.35),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          "Available Balance",
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: ShuttleXColors.accentAmber,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            "STUDENT ID: 2108040",
                            style: TextStyle(
                              color: ShuttleXColors.forestDeep,
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      "₦3,450.00",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text("Paystack Top-up Gateway Initialized..."),
                                  backgroundColor: ShuttleXColors.primary,
                                ),
                              );
                            },
                            icon: const Icon(Icons.add_circle, color: ShuttleXColors.primary, size: 18),
                            label: const Text(
                              "Fund Wallet",
                              style: TextStyle(
                                color: ShuttleXColors.primary,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                              elevation: 0,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {},
                            icon: const Icon(Icons.history, color: Colors.white, size: 18),
                            label: const Text(
                              "Statement",
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Colors.white38),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // 2. Recent Transactions Header
              const Text(
                "Recent Campus Trips & Deposits",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: ShuttleXColors.primary,
                  letterSpacing: -0.3,
                ),
              ),

              const SizedBox(height: 12),

              // 3. Transactions List
              _buildTransactionItem(
                title: "Ride: Main Gate → Faculty of Science",
                date: "Today, 2:15 PM • Honda CB125",
                amount: "-₦400.00",
                isNegative: true,
                icon: Icons.two_wheeler,
              ),
              _buildTransactionItem(
                title: "Paystack Bank Transfer Deposit",
                date: "Today, 11:30 AM • Ref #PX-82914",
                amount: "+₦2,000.00",
                isNegative: false,
                icon: Icons.account_balance,
              ),
              _buildTransactionItem(
                title: "Ride: New Hall Hostels → Library",
                date: "Yesterday, 6:40 PM • Bajaj Boxer",
                amount: "-₦500.00",
                isNegative: true,
                icon: Icons.two_wheeler,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTransactionItem({
    required String title,
    required String date,
    required String amount,
    required bool isNegative,
    required IconData icon,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: ShuttleXColors.border),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isNegative ? ShuttleXColors.cardBg : const Color(0xFFDFF5EA),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(
              icon,
              color: isNegative ? ShuttleXColors.primary : ShuttleXColors.accentGreen,
              size: 20,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: ShuttleXColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  date,
                  style: const TextStyle(
                    fontSize: 11,
                    color: ShuttleXColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Text(
            amount,
            style: TextStyle(
              fontWeight: FontWeight.w900,
              fontSize: 14,
              color: isNegative ? ShuttleXColors.textPrimary : ShuttleXColors.accentGreen,
            ),
          ),
        ],
      ),
    );
  }
}
