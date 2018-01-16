# ALC模块重难点问题

分配过程与分配模块内的重点和难点问题的说明。

## pcPceIZFSPassD

pcPceIZFSPassD是板形模型中用来标识带钢影响系数为0的道次的指针。

```C++
pcPceIZFSPassD = ( cFSPassD* )pcFstFSPassD->previous_obj;

const cFSPassD* pcFSPassD = pcFstFSPassD;

while ( pcFSPassD != NULL )
{
    // ...
    if ( pcFSPassD->pcFSStdD[ iter ]->pcLRGD->pce_infl_cof <= 0.0 )
    {
        pcPceIZFSPassD = pcFSPassD;
    }
    // ...
    pcFSPassD = ( cFSPassD* )pcFSPassD->next_obj;
}
```

首先预设定pcPceIZFSPassD为中间坯道次，即pass0。

之后一个循环，从F1到F7找到带钢影响系数为非正数的道次，用pcPceIZFSPassD指向。