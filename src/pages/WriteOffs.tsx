import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Plus, FileText, Calculator, Download } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { WriteOffForm } from "@/components/WriteOffForm"

const WriteOffs = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)

  const { data: writeOffs, isLoading: loadingWriteOffs } = useQuery({
    queryKey: ['writeOffs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('write_offs')
        .select(`
          *,
          tax_codes (
            code,
            description,
            category,
            deduction_type
          )
        `)
        .order('date', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  const { data: taxCodes, isLoading: loadingTaxCodes } = useQuery({
    queryKey: ['taxCodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tax_codes')
        .select('*')
        .order('code', { ascending: true })
      
      if (error) throw error
      return data
    }
  })

  const handleExport = async () => {
    // Generate CSV of write-offs
    const csvContent = writeOffs?.map(wo => {
      return `${wo.date},${wo.description},${wo.amount},${wo.tax_codes?.code}`
    }).join('\n')

    const blob = new Blob([`Date,Description,Amount,Tax Code\n${csvContent}`], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'write-offs.csv'
    a.click()
  }

  const analyzeWriteOffs = async () => {
    try {
      const response = await supabase.functions.invoke('analyze-financials', {
        body: { 
          type: 'writeoffs',
          data: writeOffs 
        }
      })

      if (response.error) throw response.error

      toast({
        title: "AI Analysis Complete",
        description: response.data.analysis,
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not complete AI analysis",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6 fade-in">
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="hover-scale"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tax Write-Offs</h1>
        <div className="space-x-2">
          <Button onClick={handleExport} className="hover-scale">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="hover-scale">
            <Plus className="mr-2 h-4 w-4" />
            Add Write-Off
          </Button>
        </div>
      </div>

      {showForm && <WriteOffForm />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 glass-card">
          <Calculator className="h-8 w-8 mb-4 text-primary" />
          <h3 className="text-lg font-semibold">Total Deductions</h3>
          <p className="text-3xl font-bold">
            ${writeOffs?.reduce((sum, record) => sum + Number(record.amount), 0).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Current fiscal year</p>
          <Button 
            variant="outline" 
            className="mt-4 w-full"
            onClick={analyzeWriteOffs}
          >
            Run AI Analysis
          </Button>
        </Card>
      </div>

      <Card className="p-6 glass-card">
        <h3 className="text-xl font-semibold mb-4">Available Tax Codes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {taxCodes?.map((code) => (
            <div key={code.id} className="p-4 bg-muted rounded-lg">
              <p className="font-semibold">Section {code.code}</p>
              <p className="text-sm text-muted-foreground">{code.description}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Category: {code.category}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 glass-card">
        <h3 className="text-xl font-semibold mb-4">Recent Write-Offs</h3>
        <div className="space-y-4">
          {writeOffs?.map((writeOff) => (
            <div key={writeOff.id} className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <p className="font-semibold">{writeOff.description}</p>
                <p className="text-sm text-muted-foreground">
                  Section {writeOff.tax_codes?.code} - {writeOff.tax_codes?.category}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${Number(writeOff.amount).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{new Date(writeOff.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default WriteOffs