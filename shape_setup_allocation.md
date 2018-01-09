# cAlcD::Calculate()

in alc.cpp


## some indicators

some related indicators that we have to know.
the initial values are all false.
```c++
    bool  alc_lim             ( false );                // [-] allocation limit indicator
    bool  force_pu_wid_clp    ( false );                // [-] rolling force per unit piece
                                                        //    width clamped indicator
    bool  pu_prf_same;        ( false );                // [-] target per unit profile was not
                                                        //    changed indicator
    bool  redrft_lim          ( false );                // [-] re-draft limit indicator
    bool  start_over          ( false );                // [-] start over indicator
```
## initialization
statue
```
        //------------------------------------------
        // Initialize the status indicator to valid.
        //------------------------------------------
        status = cShapeSetupD::err_valid;
```
initialize pointer to bar and last active pass.
```
        //-------------------------------------------------------------------------
        // Initialize the pointer to the dynamic FSPASS object with a zero piece
        // influence coefficient and initialize the pointer to the critical dynamic
        // FSPASS object with the pointer to the last dynamic FSPASS object.
        //-------------------------------------------------------------------------
        pcPceIZFSPassD = ( cFSPassD* )pcFstFSPassD->previous_obj;
        pcCritFSPassD = pcLstFSPassD;
```
pointer to FstFSPassD
```
const cFSPassD* pcFSPassD = pcFstFSPassD; 
```

bar alc thick related to entry piece thick of first pass.
```
        //-----------------------------------------------------------------
        // Initialize the entry piece thickness relative to the first pass.
        //-----------------------------------------------------------------
        ( ( cFSPassD* )pcFSPassD->previous_obj )->pcAlcD->thick =
            pcFstFSPassD->pcFSStdD[ iter ]->pcEnPceD->thick;
```

## calculation for pu_force_wid,thick,rollbite of every pass
from bar to last pass
if pce_infl_cof <= 0.0 then update pcPceIZFSPassD

## Calculate the minimum and maximum force change limits.
pay attention to the condition of the calculation
```
if ( redrft_perm )
        {
            //-------------------------------------------------------
            // Calculate the minimum and maximum force change limits.
            //-------------------------------------------------------
            line_num = __LINE__;
            if ( !cAlcD::Frc_Chg_Limits( iter,
                                         pcFstActFSPassD,
                                         pcLstFSPassD    ) )
            {
                status = cShapeSetupD::err_frc_sens_err;

                return;
            }
        }
```

## Calculate pu_prf_change_sum
from from first pass  to last pass

if pce_infl_cof not euqal to  0 and not dummy , calculate pu_prf_change_sum

whether strn_rlf_cof equal to 0 or not ,different calculation to pu_prf_change_sum

## pcTargtD->Delvry_Pass()

## a while loop for calculation from last pass to first pass  892 to 2029

## others related to redrft_perm



# the big while loop for heavy calcs

