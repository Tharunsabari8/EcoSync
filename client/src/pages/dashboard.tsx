import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { SupplyChainMap } from "@/components/supply-chain-map";
import { Boxes, Sprout, Microscope, Link2, Clock, Plus, TestTubeDiagonal, QrCode } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<{
    activeBatches: number;
    collectionsToday: number;
    qualityTests: number;
    blockchainTransactions: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: transactions = [] } = useQuery<any[]>({
    queryKey: ["/api/blockchain/transactions"],
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 fade-in-up">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Batches</p>
                <p className="text-2xl font-bold text-primary" data-testid="active-batches">
                  {stats?.activeBatches || 0}
                </p>
              </div>
              <Boxes className="text-primary w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Collections Today</p>
                <p className="text-2xl font-bold text-secondary" data-testid="collections-today">
                  {stats?.collectionsToday || 0}
                </p>
              </div>
              <Sprout className="text-secondary w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Quality Tests</p>
                <p className="text-2xl font-bold text-accent" data-testid="quality-tests">
                  {stats?.qualityTests || 0}
                </p>
              </div>
              <Microscope className="text-accent w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Blockchain Txns</p>
                <p className="text-2xl font-bold text-primary" data-testid="blockchain-transactions">
                  {stats?.blockchainTransactions || 0}
                </p>
              </div>
              <Link2 className="text-primary w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supply Chain Visualization */}
      <SupplyChainMap />

      {/* Recent Activities */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2 text-primary w-5 h-5" />
            Recent Blockchain Activities
          </h2>
          
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction: any) => (
              <div key={transaction.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-1">
                  {transaction.entityType === 'collection' && <Plus className="text-primary-foreground w-4 h-4" />}
                  {transaction.entityType === 'test' && <TestTubeDiagonal className="text-primary-foreground w-4 h-4" />}
                  {transaction.entityType === 'product' && <QrCode className="text-primary-foreground w-4 h-4" />}
                  {!['collection', 'test', 'product'].includes(transaction.entityType) && <Plus className="text-primary-foreground w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {transaction.entityType === 'collection' && 'Collection Event Added'}
                    {transaction.entityType === 'test' && 'Quality Test Completed'}
                    {transaction.entityType === 'product' && 'QR Code Generated'}
                    {!['collection', 'test', 'product'].includes(transaction.entityType) && 'Transaction Recorded'}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Transaction ID: {transaction.txId}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No blockchain transactions yet</p>
                <p className="text-xs">Start by recording a collection event</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
