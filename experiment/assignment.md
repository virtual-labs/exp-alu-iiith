1. Design the 1-bit programmable ALU circuit as given in the theory section. The circuit should take 2 data inputs (A, B), 2 function select inputs (S₁, S₀), and 1 carry input (Cin) for addition operations, producing appropriate outputs based on the selected function.

2. Construct and test all four operations of the ALU by setting different combinations of function select lines S₁S₀. Verify the outputs for:

   - Addition (S₁S₀ = 00): Test with various A, B, and Cin combinations
   - AND operation (S₁S₀ = 01): Test logical AND functionality
   - OR operation (S₁S₀ = 10): Test logical OR functionality
   - XOR operation (S₁S₀ = 11): Test exclusive OR functionality

3. Design a 4-bit ALU by cascading four 1-bit ALUs. The circuit should process two 4-bit numbers A₃A₂A₁A₀ and B₃B₂B₁B₀, with shared function select lines S₁S₀ controlling all four ALU units simultaneously. For arithmetic operations, ensure proper carry propagation between stages.

4. Analyze the role of the multiplexer in the ALU design. Can the 4-to-1 multiplexer be replaced with a different selection mechanism? If yes, suggest an alternative approach. If no, explain why the multiplexer is essential for this particular ALU architecture.
