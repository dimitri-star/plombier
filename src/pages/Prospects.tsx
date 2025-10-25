import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Prospects() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Prospects</h1>
          <p className="mt-2 text-muted-foreground">
            Gérez et suivez vos prospects
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau prospect
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des prospects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Aucun prospect pour le moment
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
